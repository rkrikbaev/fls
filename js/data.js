// Data for assets

[{
    "name": null, // format: location/name
    "id": null, // fp catalog field 'id'
    "serialNumber": 12345, //asset serial catalog number
    "description": null, // Model, manufactor and etc
    "state": null, // { asset: [on-line, off-line, retired, standby], spare:[available, not-available, less]}
    "reason": null, // {"on-line":[in-use], "off-line":[damaged, under_repair], "retired":[replaced, in_storage], "standby":[available, in_rotation, quality_check]}
    "dtScheduledMaintStart": null, //datetime when maintenance activity must be started by workhors
    "dtScheduledMaintFinish": null, // datetime when maintenance activity shoud be completed
    "dtScheduledMaintCalculatedStart": null, // datetime when MA actually will be started due to ...
    "hrsLiveTimeLeft": null, // how many hours left
    "cntMADone": null, // count of MA already done for selected period
    "cntMACompletedInTime": null, // count of MA already completed for selected period
    "cntMADelayed": null, // count of MA delayed for selected period
    "nextMaintDescription": null, // description of next MA
    "hrsTotalLiveTime": null, // total workhors
    "hrsMeanLivTime": null,
    "hrsMaxLivTime": null,
    "hrsMinLivTime": null,
    "kpiDowntime": null,
    "kpiMTBF": null,
    "kpiMTTR": null, //
    "kpiPMC": null,
    "notes": null,
    "documentLink": null,
    "recordCreated": null
}]
    
// JSON Data for event
// Event created as part of schudle of MA

[{
    "date":null, // date when event accures
    "name": null, // fp catalog field '.name'
    "id": 123, // fp catalog field 'id'
    "description": null, // description of what will be done and what spare parts will be used?
    "state": null, // qued, complited, rejected, shifted, delayed
    "engineer": null, // name of active user
    "dtScheduledMaintStart": null, // date when MA must be done, calculated as next_date = repair_date + workhors, where workhors = operation days * 24 
    "dtScheduledMaintFinish": null, 
    "dtScheduledMaintFactStart": null,
    "dtScheduledMaintFactFinish": null,
    "dtScheduledMaintCalculatedStart": null, // datetime when MA actually will be started due to ...
    "sparePartsList": [], //
    "notes": null,
    "documenLink": null,
    "recordCreated": null
}]
