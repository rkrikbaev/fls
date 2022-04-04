from calendar import week
import requests
import time
import logging
import json
from datetime import datetime
from itertools import groupby

# create logger
logger = logging.getLogger("logic")
logger.setLevel(logging.DEBUG)


update_event = "event_update"
get_all_events = "events_getall"
get_all_assets = "assets_getall"

# url = 'http://138.68.70.41:9003/rest/server'


def get_data(url:str, payload:dict=None, method:str="GET", key:str=None)->dict:
    
    _objects = None

    if method.upper() == "GET":
        try:

            r = requests.get(url, timeout=10)
            _objects = json.loads(r.text)['data']

        except Exception as exc:
            logger.error(exc) 
    
    elif  method.upper() == "POST":       
        try:

            r = requests.post(url, data=json.dumps(payload), timeout=10)
            _objects = json.loads(r.text)['data']
            # print(_objects)

        except Exception as exc:
            logger.error(exc)        
        
    if _objects:

        _keys = _objects[0]
        _values = _objects[1:]

        keyfunc = lambda x:x[key]

        _data = [dict(zip(_keys, _value)) for _value in _values]

        if key:
            _output = {}
            _data_sorted = list(sorted(_data, key=keyfunc))
            for task, action in groupby(_data_sorted, key=keyfunc):     
                _action = list(action)
                _output[task] = _action
            # print(_objects)
            return _output
        else:
            return _data

def put_data(url:str, payload:dict):

    try:
        _data = json.dumps(payload)
        r = requests.post(url, data=_data, timeout=10)

    except Exception as exc:
        logger.error(exc)        

class Event():
    
    def __init__(self, asset, task) -> None:

        self.id = None
        self.ts = None
        self.name = None
        self.workhours = None
        self.state = None
        self.action = None
        self.unit = asset
        self.task = task
        self.date_start = None
        self.date_predict_start = None
        self.week_number = None
        self.date = None
        self.state = None
        

        self.payload = {
            "id": None, 
            "name": None,
            "week_number": None,
            "workhours" : None, 
            "state": None,
            "task": None,
            "date_start": None,
            "date_predict_start": None,
            "unit":None,
            "date": None
            }

    def create(self, **kwarg):
        
        self.payload = {}

        self.payload['id'] = self.id
        self.payload['name'] = self.name
        self.payload['week_number'] = self.week_number
        self.payload['workhours'] = self.workhours
        self.payload['state'] = self.state
        self.payload['task'] = self.task
        self.payload['date_start'] = str(self.date_start)
        self.payload['date_predict_start'] = str(self.date_predict_start)
        self.payload['unit'] = self.unit
        self.payload['date'] = self.date

        return self.payload
        
    def update(self, **kwarg):

        self.payload = {}
        self.date = str(datetime.today().strftime('%Y-%m-%d-%H:%M:%S'))
        self.date_predict_start = self.date_start

        self.payload['id'] = self.id
        self.payload['name'] = self.name
        self.payload['week_number'] = self.week_number
        self.payload['workhours'] = self.workhours
        self.payload['state'] = self.state
        self.payload['task'] = self.task
        self.payload['date_start'] = str(self.date_start)
        self.payload['date_predict_start'] =str(self.date_predict_start)
        self.payload['unit'] = self.unit
        self.payload['date'] = self.date
        
        return self.payload

class Asset():

    def __init__(self, asset) -> None:
            self.name = asset
            self.tasks = None
            self.events = None


if __name__ == "__main__":
    
    while True:

        d = {}

        while not d:
        
            current_week = datetime.now().isocalendar()[1]
            current_year = datetime.now().isocalendar()[0]
            try:
                # get all list of assets
                url = 'http://138.68.70.41:9003/rest/server/assets_getall'
                d = get_data(url)
        
                assets = [item['.name'] for item in d if bool(item['.name'])]
            except Exception as exc:
                print("ERROR: ", exc)
        else:

            if assets:
                # проходим по всем машинам заявленым в каталоге
                # 1. Проверяем необходимость создания новго события
                # 2. Обновляем текущий статус согласно командам от пользователя
                for unit in assets:

                    asset = Asset(unit)
                    
                    print("unit name: ", asset.name)

                    # get all tasks on this asset
                    asset.tasks = get_data(
                        url= 'http://138.68.70.41:9003/rest/server/tasks_by_asset', 
                        payload= {"asset": asset.name}, 
                        method='POST', 
                        key= 'task'
                        )
                    # get all exist events on this asset
                    asset.events = get_data(
                        url= 'http://138.68.70.41:9003/rest/server/events_by_asset', 
                        payload= {"asset": asset.name}, 
                        method= 'POST', 
                        key= 'task'
                        )   

                    if  asset.tasks:   
                        
                        for task in asset.tasks:

                            event = Event(unit, task)
                            index = 0

                            event.task = task
                            event.ts = int(time.time())

                            # max timestamp of future task in seconds
                            step = asset.tasks[task][0]['time_to_failure'] * 7 * 24 * 3600 
                            future_len = asset.tasks[task][0]['future_len'] * 7 * 24 * 3600

                            max_range = event.ts + future_len
                            
                            # take datetime of last record to calculate next record
                            if asset.events:
                                if task in asset.events:
                                    event_date_start = asset.events[task][-1]['date_start']
                                    if asset.events[task][-1]['.name'].find(':') != -1:
                                        _, index = asset.events[task][-1]['.name'].split(':')
                                        if not index:
                                            index = 0
                                        else:
                                            index = int(index)
                                    if event_date_start:
                                        event.ts = int(time.mktime(datetime.strptime(event_date_start,"%Y-%m-%d %H:%M:%S").timetuple()))
                                    else:
                                        pass
                                else:
                                    pass
                            else:
                                pass
                            
                            # create new events if it is nesseccary
                            while (max_range - event.ts) > step:

                                index = index + 1
                                event_horiz = max_range - event.ts
                                print("-------------------------------")
                                print("event name: ",task)
                                print('prev events index: ', index)
                                print("prev event date_start: ", event_date_start)
                                print("step: ", step)
                                
                                print("horz: ", event_horiz)
                                if event_horiz > step: print(f"range more than step: {event_horiz}>{step} ")
                                print('create new event with index: ', index)

                                event.ts = event.ts + step
                                
                                event.state = 'queued'

                                event.date_start = datetime.fromtimestamp(event.ts)
                                event.week_number = event.date_start.isocalendar()[1]
                                event.name = f'{unit}@{task}:{index}'
                                event.date = str(datetime.today().strftime('%Y-%m-%d-%H:%M:%S'))
                                event.id = event.ts
                                event.date_predict_start = event.date_start

                                payload = event.create()
                                
                                put_data(
                                    url= 'http://138.68.70.41:9003/rest/server/event_create',
                                    payload=payload
                                    )

                                time.sleep(2)
                            
                            #
                            # checkout future event and change start date if nesseccary
                            #
 
                            if task in asset.events:

                                _events = [x for x in asset.events[task] if (x['state'] != 'completed')]

                                # update state of events
                                for index, _event in enumerate(_events):

                                    event = Event(asset.name, task)

                                    event.id = _event['id']
                                    event.name = _event['.name']
                                    event.action = _event['action']
                                    # event.state = _event['state']                               
                                    
                                    if _event['action']:

                                        if _event['state'] == None:     
                                            _event['state'] = 'queued' 
                                        
                                        if (event.action == 'start') and not (_event['state'] == 'in-progress'):
                                            _event['state'] = 'in-progress'
                                            _event['date_start'] = datetime.now().isoformat(timespec='seconds', sep=' ')
                                            _event['week_number'] = datetime.now().isocalendar()[1]
                                        
                                        elif (event.action == 'finish'):
                                            _event['state'] = 'completed'
                                        
                                        elif (event.action == 'cancel') and not (_event['state'] == 'canceled'):                                            
                                            _event['state'] = 'canceled'
                                        
                                        elif event.action == 'continue' and not (_event['state'] == 'in-progress'):                                       
                                            _event['state'] = 'in-progress'                            
                                                
                                    if ((_event['state'] == 'queued') or (_event['state'] == 'in-progress')):

                                        _date_start = _event['date_start']
                                        event.ts = int(time.mktime(datetime.strptime(_date_start,"%Y-%m-%d %H:%M:%S").timetuple()))                            
                                        
                                        if index < (len(_events) - 1):
                                            if (_events[index+1]['state']) == 'queued':
                                                _events[index+1]['date_start'] = str(datetime.fromtimestamp(event.ts + step))

                                    event.action = None
                                    event.state =  _event['state']
                                    event.date_start = _event['date_start']
                                    event.workhours = _event['workhours']
                                    event.week_number = _event['week_number']
                                    event.date_predict_start = _event['date_predict_start']

                                    payload = json.dumps(event.update())
                                    # print(payload)
                                    put_data(
                                        url= 'http://138.68.70.41:9003/rest/server/event_create',
                                        payload=payload
                                    )


            time.sleep(10)

