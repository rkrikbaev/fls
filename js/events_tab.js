
// grid configuration
{
    navigatable: true,
    pageable: true,
    height: 550,
    toolbar: ["excel", "pdf"],
    // editable: true,
    editable: "popup",
    "columns": [
        {
            "field": "unit",
            // "title": fp_dev.text("Unit"),
            "width": "8em",
            headerTemplate: '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Unit</p></div>',
            "template": data => {
                return `<div style="font-weight:bold;">${data.unit}</div>`;
            }
        },
        {
            "field": "procedure",
            "width": "8em",
            // "title": fp_dev.text("Procedure Name"),
            headerTemplate: '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Procedure</p></div>',
        },
        {
            "field": "state",
            "title": fp_dev.text("State"),
            "width": "8em",
            headerTemplate: '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">State</p></div>',
            "template": data => {
                let backColor = "white";
                let fontColor = "black";
                if (data.state === "queued") {
                    backColor = "gray";
                    fontColor = "black";
                } else if (data.state === "in-progress") {
                  backColor = "blue"; 
                } else if (data.state === "complited") {
                  backColor = "grey";
                } else if (data.state === "canceled") {
                  backColor = "gold";
                  fontColor = "black";
                }else if (data.state === "delayed") {
                  backColor = "red";
                  fontColor = "gold";
                }
                return `<div style="text-align:center;background-color:${backColor};color:${fontColor}">${data.state}</div>`;
            }
        },
        {
            "field": "action",
            "width": "12em",
            headerTemplate: '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Action</p></div>',
            command:[
                {
                    name: "Start",
                    iconClass: "k-icon k-i-login",
                    visible:function(item){ 
                        return item.state==="queued"
                    },
                    click:function(e){
                        e.preventDefault();
                        const tr = $(e.target).closest("tr");
                        const data = this.dataItem(tr);
                        console.log("DEBUG: data", data);
                        fp_dev.yesno('Start the task?',()=>{
                            fp.rt.get_asyncconnection().edit_object(data.oid,{state:"in-progress"},null,fp_dev.error);
                        });
                    }
            },
            {
                    name: 'Finish',
                    iconClass: "k-icon k-i-logout",
                    visible:function(item){ 
                        return item.state==="in-progress" 
                    },
                    click:function(e){
                        e.preventDefault();
                        const tr = $(e.target).closest("tr");
                        const data = this.dataItem(tr);
                        fp_dev.yesno('Job completed?',()=>{
                            fp.rt.get_asyncconnection().edit_object(data.oid,{state:"completed"},null,fp_dev.error);
                        });
                    }
            },
            {
                    name: 'Cancel',
                    iconClass: "k-icon k-i-close",
                    visible:function(item){ 
                        return item.state==="in-progress" 
                    },
                    click:function(e){
                        e.preventDefault();
                        const tr = $(e.target).closest("tr");
                        const data = this.dataItem(tr);
                        fp_dev.yesno('Cancel the job?',()=>{
                            fp.rt.get_asyncconnection().edit_object(data.oid,{state:"canceled"},null,fp_dev.error); //()=>fp_dev.notify("ok")
                        });
                    }
            },
            {
                name: "Continue",
                iconClass: "k-icon k-i-reload",
                visible:function(item){ 
                    return item.state==="canceled"
                },
                click:function(e){
                    e.preventDefault();
                    const tr = $(e.target).closest("tr");
                    const data = this.dataItem(tr);
                    console.log("DEBUG: data", data);
                    fp_dev.yesno('Start the task?',()=>{
                        fp.rt.get_asyncconnection().edit_object(data.oid,{state:"in-progress"},null,fp_dev.error);
                        //console.log("info", `unit name: " + ${data.unit}`);
                    });
                }
        }]
        },
        {
            field: "workhours",
            width: "6em",
            headerTemplate: '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Workhours</p></div>'
        },
        {
          "field": "dtStart",
          "width":"6em",
        //   "title": fp_dev.text("Start date")
          headerTemplate: '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Start dt</p></div>',
        },
        {
          "field": "dtCalcStart",
          "width": "6em",
        //   "title": fp_dev.text("Calc start date")
        headerTemplate: '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Calculated dt</p></div>',
        },
        {
          "field": "engineer",
          "width": "8em",
        //   "title": fp_dev.text("Enginner ID")
        headerTemplate: '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Enginner ID</p></div>',
        },
        {
            name: "edit",
            width: "5em",
            headerTemplate: '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Edit Table</p></div>',
            "command":[
                {
                    name: "edit",
                    iconClass: "k-icon k-i-edit",
                    visible:function(item){ 
                        return true
                    }
                }
        ]
    }]
}


// dinamic filter
function(VARS,element,context){
    
    let catalog = 'EVENT';
    let selector = VARS.selector.get();
    let filters = [];
    
    let filter=".folder='@dummy'";
    
    if (selector){
        filters = selector.map((folder)=>{
            return {
                "field": "_folder",
                "operator": "eq", 
                "value": `$oid('/root/PROJECT/CATALOGS/${catalog}/${folder}')`  
            }
        });
    };
   console.log("DEBUG filters: ", filters);
    let value = {
            "logic": "or", 
            "filters": filters
        };
    
    console.log("DEBUG value: ", value);
    
    return value;
}

// statiic filter config
{
    "logic": "or",
    "filters": [
        {
            "field": "_folder",
            "operator": "eq",
            "value": "$oid('/root/PROJECT/CATALOGS/EVENT/unit_a')"
        },
        {
            "field": "_folder",
            "operator": "eq",
            "value": "$oid('/root/PROJECT/CATALOGS/EVENT/unit_b')"
        },
        {
            "field": "_folder",
            "operator": "eq",
            "value": "$oid('/root/PROJECT/CATALOGS/EVENT/unit_c')"
        }
    ]
}


// iot bindings action update event

fp.rt.get_asyncconnection().edit_object(data.oid,{state:"in-progress"},null,fp_dev.error);
