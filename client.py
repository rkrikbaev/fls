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

        except Exception as exc:
            logger.error(exc)        
        
    if _objects:

        _keys = _objects[0]
        _values = _objects[1:]

        _data = [dict(zip(_keys, _value)) for _value in _values]

        if key:
            _output = {}
            for task, action in groupby(_data, key=lambda x:x[key]):     
                _action = list(action)
                _output[task] = _action
            print(_objects)
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
        self.start_week = None
        self.date = None
        self.state = None
        

        # self.payload = {
        #     "id": None, 
        #     "name": None,
        #     "week_number": None,
        #     "workhours" : None, 
        #     "state": None,
        #     "task": None,
        #     "date_start": None,
        #     "date_predict_start": None,
        #     "unit":None,
        #     "date": None
        #     }

    def create(self, **kwarg):
        
        self.payload = {}

        self.state = "queued"
        self.date_start = datetime.fromtimestamp(event.ts)
        self.start_week = self.date_start.isocalendar()[1]
        self.name = f'{self.unit}@{self.task}:{self.start_week}'
        self.date = str(datetime.today())
        self.id = self.ts

        self.payload['id'] = self.id
        self.payload['name'] = self.name
        self.payload['week_number'] = self.start_week
        self.payload['workhours'] = self.workhours
        self.payload['state'] = self.state
        self.payload['task'] = self.task
        self.payload['date_start'] = str(event.date_start)
        self.payload['date_predict_start'] = str(event.date_start)
        self.payload['unit'] = self.unit
        self.payload['date'] = self.date

        return self.payload
        
    def update(self, **kwarg):

        self.payload = {}

        self.date_start = datetime.fromtimestamp(event.ts)
        self.start_week = self.date_start.isocalendar()[1]
        self.date = datetime.fromtimestamp(int(time.time()))
        

        self.payload['id'] = self.id
        self.payload['name'] = self.name
        self.payload['week_number'] = self.start_week
        self.payload['workhours'] = self.workhours
        self.payload['state'] = self.state
        self.payload['task'] = self.task
        self.payload['date_start'] = str(event.date_start)
        self.payload['date_predict_start'] = str(event.date_start)
        self.payload['unit'] = self.unit
        self.payload['date'] = str(datetime.today())
        
        return self.payload


class Asset():

    def __init__(self, asset) -> None:
            self.name = asset
            self.tasks = None
            self.events = None



if __name__ == "__main__":
    
    while True:

        d =False

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
                # 2. Обновляем текущий статус
                for item in assets:

                    asset = Asset(item)
                    
                    print("unit name: ", asset.name)

                    # get all tasks on this asset
                    # url = 'http://138.68.70.41:9003/rest/server/tasks_by_asset'
                    print("DEBUG: read list of assets")
                    asset.tasks = get_data(
                        url= 'http://138.68.70.41:9003/rest/server/tasks_by_asset', 
                        payload= {"asset": asset.name}, 
                        method='POST', 
                        key= 'task'
                        )          
                    
                    # get all exist events on this asset
                    # url = 'http://138.68.70.41:9003/rest/server/events_by_asset'
                    print("DEBUG: read list of events")
                    asset.events = get_data(
                        url= 'http://138.68.70.41:9003/rest/server/events_by_asset', 
                        payload= {"asset": asset.name}, 
                        method= 'POST', 
                        key= 'task'
                        )

                    for task in asset.tasks:

                        event = Event(asset.name, task)

                        # event.task = task['task']
                        event.ts = int(time.time())

                        # max timestamp of future task in seconds
                        step = asset.tasks[task][0]['time_to_failure'] * 7 * 24 * 3600 
                        future_len = asset.tasks[task][0]['future_len'] * 7 * 24 * 3600

                        max_range = event.ts + future_len
                        
                        # take datetime of last record to calculate next record
                        if asset.events:
                            if task in asset.events:
                                event_date_start = asset.events[task][-1]['date_start']
                                if event_date_start:
                                    event.ts = int(time.mktime(datetime.strptime(event_date_start,"%Y-%m-%d %H:%M:%S").timetuple()))
                                else:
                                    pass
                            else:
                                pass
                        else:
                            pass

                        # create new events if it is nesseccary
                        while event.ts < max_range:

                            event.ts = event.ts + step
                            
                            # url = 'http://138.68.70.41:9003/rest/server/event_add'
                            payload = event.create()
                            put_data(
                                url= 'http://138.68.70.41:9003/rest/server/event_add',
                                payload=payload
                                )

                            time.sleep(2)
                        
                        #
                        # checkout future event and change start date if nesseccary
                        #
                        if asset.events:
                            _events = [item for item in asset.events[task] if (item['week_number'] >= current_week)]
                            
                            # _events = list(sorted(_events_filtered, key=lambda x:x['id']))

                            # update state of events
                            for index, _event in enumerate(_events):

                                event = Event(asset.name, task)

                                event.id = _event['id']
                                event.name = _event['.name']
                                event.state = _event['state']
                                event.action = _event['action']

                                _date_start = _event['date_start']
                                event.ts = int(time.mktime(datetime.strptime(_date_start,"%Y-%m-%d %H:%M:%S").timetuple()))                            

                                if index < (len(_events) - 1):
                                    if (_events[index+1]['state']) == 'queued':
                                        _events[index+1]['date_start'] = str(datetime.fromtimestamp(event.ts + step)) 

                                if event.action == 'start':
                                    
                                    event.state = 'in-progress'
                                    event.date_start = str(datetime.today())
                                    print(event.name, event.action, event.state)
                                
                                elif (event.action == 'finish') and not (event.state == 'completed'):
                                    
                                    event.state = 'completed'
                                    if index < (len(_events) - 1):
                                        _events[index+1]['workhours'] = _events[index]['workhours']
                                
                                elif event.action == 'cancel':
                                    
                                    event.state = 'canceled'
                                
                                elif event.action == 'continue':
                                    
                                    event.state = 'in-progress' 
                                
                                # else:
                                    # check if event still in line
                                    # _date_start = _event['date_start']
                                    # event.ts = int(time.mktime(datetime.strptime(_date_start,"%Y-%m-%d %H:%M:%S").timetuple()))

                                payload = json.dumps(event.update())
                                put_data(
                                    url= 'http://138.68.70.41:9003/rest/server/event_add',
                                    payload=payload
                                    )
                        

            time.sleep(10)

