// Asset JSON

let asset = [{
    "scrollable": {
            "virtual": true
        },
    "columns": [
        {
          "field": "name",
          "title": "Asset Name",
          "width": "12em",
          "template":data=>{
          return `<div style="font-weight:bold;">${ data.name }</div>`;
      }
    },
    {
      "field": "state",
      "title": "State",
      "width":"10em",
      "template": data => {
        
          let backColor = "gray";
          let fontColor = "white";
          
          if (data.state === "on-line"){
            backColor = "green";
            fontColor = "black";
            
          }else if(data.state === "off-line"){
            backColor = "blue";
          }else if(data.state === "retired"){
            backColor = "gold";
            fontColor = "black";
          }else if(data.state === "standby"){
            backColor = "red";
            fontColor = "gold";
          }
          return `<div style="text-align:center;background-color:${ backColor };color:${ fontColor }">${ data.state }</div>`;
      }
    },
    {
      "field": "reason",
      "width":"10em",
      "title": fp_dev.text("Reason"),    
    },
    {
      "field": "dtScheduledMaintStart",
      "width":"10em",
      "title": fp_dev.text("Scheduled MA start")
    },
    {
      "field": "hrsLiveTimeLeft",
      "title": fp_dev.text("Livetime left")
    },
    {
      "field": "cntMADone",
      "title": fp_dev.text("MA done")
    },
    {
      "field": "cntMADelayed",
      "title": fp_dev.text("MA delayed")
    },
    {
      "field": "kpi_mtbf",
      "title": fp_dev.text("KPI mtbf")
    },
    {
      "field": "kpi_mttr",
      "title": fp_dev.text("KPI mttr")
    },
    {
      "field": "hours_totalLiveTime",
      "title": fp_dev.text("Total Live Time")
    },
    {
      "field": "documentLink",
      "title": fp_dev.text("Documents"),
      "template": `<a href="http://kendo.cdn.telerik.com/2016.1.226/styles/kendo.common.min.css" target="_blank" title="User manual">Link to Maintanence manual</a>`
    }]
}]

// Spare parts JSON

let sparepart = [{
  "columns": [
    {
      "field": "name",
      "title": " ",
      "width":"17em",
      "template":data=>{
          return `<div style="font-weight:bold;">${ data.name }</div>`;
      }
    },
    // {
    //   "field": "Id",
    //   "title": fp_dev.text("Id")
    // },
    {
      "field": "state",
      "title": "State",
      "width":"10em",
      "template": data => {
        
          let backColor = "gray";
          let fontColor = "white";
          
          if (data.state === "available"){
            backColor = "green";
            fontColor = "black";
            
          }else if(data.state === "not available"){
            backColor = "blue";
          }else if(data.state === "less_then"){
            backColor = "gold";
            fontColor = "black";
          }
          return `<div style="text-align:center;background-color:${ backColor };color:${ fontColor }">${ data.state }</div>`;
      }
    },
    {
      "field": "dtScheduledMaintStart",
      "width":"10em",
      "title": fp_dev.text("Scheduled start")
    },
    {
      "field": "dtScheduledMaintFinish",
      "title": fp_dev.text("scheduled finish")
    },
    {
      "field": "dtScheduledMaintCalculatedStart",
      "title": fp_dev.text("Predicted date")
    },
    {
      "field": "hrsLiveTimeLeft",
      "title": fp_dev.text("Livetime left")
    },    
    {
      "field": "hrsMeanLivTime",
      "title": fp_dev.text("hours mean livetime")
    },
    {
      "field": "hrsMaxLivTime",
      "title": fp_dev.text("Max Live Time")
    },
    {
      "field": "hrsMinLivTime",
      "title": fp_dev.text("Min Live Time")
    },
    {
      "field": "serialNumber",
      "title": fp_dev.text("Serial")
    },
    {
      "field": "description",
      "title": fp_dev.text("Description")
    },
    {
      "field": "Notes",
      "title": fp_dev.text("Notes")
    },
    {
      "field": "documentLink",
      "title": fp_dev.text("Documets")
    }
  ]
}]


// Event JSON

let event = [{
  "columns": [
    {
        "field": "unit",
        "title": fp_dev.text("Unit"),
        "width": "8em",
        "template": data => {
        return `<div style="font-weight:bold;">${data.unit}</div>`;
        }
    },
    {
        "field": "procedure",
        "width": "8em",
        "title": fp_dev.text("Procedure Name")
    },
    {
        "field": "state",
        "title": fp_dev.text("State"),
        "width": "8em",
        "template": data => {
            let backColor = "gray";
            let fontColor = "white";
            if (data.state === "qued") {
                backColor = "gray";
                fontColor = "black";
            } else if (data.state === "in-progress") {
              backColor = "blue"; 
            } else if (data.state === "complited") {
              backColor = "blue";
            } else if (data.state === "rejected") {
              backColor = "gold";
              fontColor = "black";
            } else if (data.state === "shifted") {
              backColor = "red";
              fontColor = "gold";
            }else if (data.state === "delayed") {
              backColor = "red";
              fontColor = "gold";
            }
            return `<div style="text-align:center;background-color:${backColor};color:${fontColor}">${data.state}</div>`;
        }
    },
    {
        "field": "action",
        "editable": true,
        "width": "8em",
        "headerTemplate": '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Action</p></div>',
        "command":[
        {
            name: 'Start',
            visible:function(item){ 
                return item.state==="queued" 
            },
            click:function(e){
                e.preventDefault();
                const tr = $(e.target).closest("tr");
                const data = this.dataItem(tr);
                fp_dev.yesno('Start the task?',()=>{
                    // fp.api.set_value(`/root/PROJECT/CATALOGS/EVENT/${data.unit}`, action, "START" );
                    console.log("info", `unit name: " + ${data.unit}`);
                });
            }
        },
        {
            name: 'Finish',
            visible:function(item){ 
                return item.state==="in-progress" 
            },
            click:function(e){
                e.preventDefault();
                const tr = $(e.target).closest("tr");
                const data = this.dataItem(tr);
                fp_dev.yesno('Job completed?',()=>{
                    fp.api.set_value(`/root/PROJECT/CATALOGS/EVENT/${data.unit}`, action, "COMPLETE");
                });
            }
        },
        {
            name: 'Cancel',
            visible:function(item){ 
                return item.state==="in-progress" 
            },
            click:function(e){
                e.preventDefault();
                const tr = $(e.target).closest("tr");
                const data = this.dataItem(tr);
                fp_dev.yesno('Cancel the job?',()=>{
                    fp.api.set_value(`/root/PROJECT/CATALOGS/EVENT/${data.unit}`, action, "CANCEL");
                });
                }
        }]
    },
    {
      "field": "engineer",
      "width": "5em",
      "title": fp_dev.text("Enginner ID")
    },
    {
      "field": "dtStart",
      "width":"5em",
      "title": fp_dev.text("Start date")
    },
    {
      "field": "dtFinish",
      "width": "5em",
      "title": fp_dev.text("Complete date")
    },
    {
      "field": "shiftStart",
      "width": "5em",
      "title": fp_dev.text("Calc start date")
    },
    {
      "field": "documentLink",
      "width": "5em",
      "title": fp_dev.text("Documentation")
    }]
}]

