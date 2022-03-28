

   





[{
    "scrollable": {
        "virtual": true
    },
    "height": 550,
    "filterable": false,
    "sortable": true,
    "pageable": true,
    "pageable": {
        "alwaysVisible": true,
        "input": true,
        "numeric": false,
        "pageSizes": [100,200],
        "pageSize":200
    },
    "groupable": true,
    "columns": [
        {
            "field": "dt",
            // "title": "Дата поступления",
            "editable": false,
            "sortable": false,
            "filterable": false,
            "width": 160,
            // "attributes": { "style": "text-align: center; background-color:#: (P_status_TI)?\"transparent\":\"yellow\" #"},
            "headerTemplate": '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Дата поступления</p></div>'
        },
        {
            "field": "orderId",
            //"title": "# Задания",
            "editable": false,
            "width": 120,
            "headerTemplate": '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal"># Задания</p></div>'
        },
        {
            "field": "unit_name",
            //"title": "Линия",
            "editable": false,
            "width": 120,
            "headerTemplate": '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Линия</p></div>'
        },
        {
            "field": "status",
            //"title": "Состояние",
            "editable": false,
            "width": 120,
            "headerTemplate": '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Состояние</p></div>'
        },
        {
            "field": "dt_start",
            //"title": "Начат",
            "editable": false,
            "width": 120,
            "headerTemplate": '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Начат</p></div>'
        },
        {
            "field": "dt_finish",
            //"title": "Завершен",
            "editable": false,
            "width": 120,
            "headerTemplate": '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Завершен</p></div>'
        },
        {
            "field": "max_quant_pack",
            //"title": "Выполнен",
            "editable": false,
            "width": 120,
            "headerTemplate": '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Выполнен</p></div>'
        },
        {
            "field": "comment",
            //"title": "Действие",
            "editable": true,
            "width": 120,
            "headerTemplate": '<div style="font-size: 14px; text-align: center; font-weight: regular";><p style="white-space: normal">Действие</p></div>',
            "command":[
                {
                    name: 'Отменить',
                    visible:function(item){ 
                        return item.status==="wait" 
                    },
                    click:function(e){
                        e.preventDefault();
                        const tr = $(e.target).closest("tr");
                        const data = this.dataItem(tr);
                        fp_dev.yesno('Отменить заказ?',()=>{
                            fp.rt.get_asyncconnection().edit_object(data.oid,{status:"cancel"},undefined,fp_dev.error);
                        });
                    }
                },
                {
                    name: 'Продолжить',
                    visible:function(item){ 
                        return item.status==="cancel" 
                    },
                    click:function(e){
                        e.preventDefault();
                        const tr = $(e.target).closest("tr");
                        const data = this.dataItem(tr);
                        fp_dev.yesno('Продолжить заказ?',()=>{
                            fp.rt.get_asyncconnection().edit_object(data.oid,{status:"wait"},undefined,fp_dev.error);
                        });
                    }
                }
            ]
        }
    ],
    //     "dataBound": function (e) {
    //     var grid = this;
    //     $(".k-grouping-row").each(function (e) {
    //         grid.collapseGroup(this);
    //     });
    // }
}]







// ---------------- example -----------------------

[{
    "toolbar":["excel"],
            "excel": {
                "fileName": "PS_KP.xlsx",
                "filterable": true,
                "allPages":true
            },
    "sortable": true,
    "scrollable": true,
    "pageable": true,
    "groupable": true,
    "pageSize":10,
    "columnMenu": true,
    "columns":[
                    {
                        //"headerTemplate": '<div style="vertical-align: middle; height:15px; font-size: 18px; text-align: left; font-weight: bold;";><p style="white-space: normal;">Расход ресурсов на производство 1 т клинкера</p></div>',
                        "title": "Расход ресурсов на производство 1 т клинкера",
                        "columns" : [
                    
                                        // {
                                        //  "headerTemplate": '<div style="font-size: 12px; text-align: left; font-weight: bold";><p style="white-space: normal">№ </p></div>',
                                        //  "headerAttributes": { "style": "width:300px"},
                                        //  "field":"Object",
                                        //  "width":"10px",
                                        //  "heght": "5px",
                                        //  "hidden": true,
                                        //  "attributes": { "style": "text-align: left; visibility: hidden;"},
                                        //  "groupHeaderTemplate": function (data) {
                                        //       return `<div style="display: flex; align-items: right;">
                                        //                     <p style="margin-right: 100px;">${data.value}</p>
                                        //              </div>`
                                        //     }
                                        // },
                                        {
                                        "title": "Дата",
                                        //"headerTemplate": '<div style="font-size: 12px; text-align: center; font-weight: bold;><p style="white-space: normal">Дата</p></div>',
                                        // "headerAttributes": { "style":"width: 50px"},
                                        "field": "Date",
                                        // "width":"200px",
                                        // "heght": "5px",
                                        "attributes": { "style": "text-align: left;"},
                                        "footerTemplate": "Всего:"
                                        },
                                        {
                                        "title": "Участок",
                                        // "headerTemplate": '<div style="font-size: 12px; text-align: center; font-weight: bold";><p style="white-space: normal">Известняк, т</p></div>',
                                        "headerAttributes": { "style":"width: 50px"},
                                        "field":"Area",
                                        // "template":  function (data) {
                                        //     const value = data.f1;
                                            
                                        //     return `<div style="text-align: center; background-color:${ parseInt(value) < 50 ? "#F34723" : parseInt(value) < 90 ?"#FFD700" : parseInt(value) > 90 ? "#50C878" : "" };"> 
                                        //                 ${value}
                                        //             </div>`;
                                        // },
                                        // "groupHeaderColumnTemplate": function (data) {
                                        //     const min = data.f1.average;
                                            
                                        //     return `<div style="text-align: center;color: ${ min < 50 ? "#F34723" : min <= 90 ?"#FFD700" : min > 90 ? "#50C878" : ""} "> ${min}% </div>`;
                                        //     }
                                        },
                                        {
                                        "title": "Известняк, т",
                                        // "headerTemplate": '<div style="font-size: 12px; text-align: center; font-weight: bold";><p style="white-space: normal">Известняк, т</p></div>',
                                        "headerAttributes": { "style":"width: 50px"},
                                        "field":"f1",
                                        // "template":  function (data) {
                                        //     const value = data.f1;
                                            
                                        //     return `<div style="text-align: center; background-color:${ parseInt(value) < 50 ? "#F34723" : parseInt(value) < 90 ?"#FFD700" : parseInt(value) > 90 ? "#50C878" : "" };"> 
                                        //                 ${value}
                                        //             </div>`;
                                        // },
                                        // "groupHeaderColumnTemplate": function (data) {
                                        //     const min = data.f1.average;
                                            
                                        //     return `<div style="text-align: center;color: ${ min < 50 ? "#F34723" : min <= 90 ?"#FFD700" : min > 90 ? "#50C878" : ""} "> ${min}% </div>`;
                                        //     }
                                        },
                                        {
                                        "title": "Глина, т",
                                        // "headerTemplate": '<div style="font-size: 12px; text-align: center; font-weight: bold";><p style="white-space: normal">Глина, т</p></div>',
                                        "headerAttributes": { "style":"width: 50px"},
                                        "field":"f2",
                                        // "template":  function (data) {
                                        //     const value = data.f2;
                                            
                                        //     return `<div style="text-align: center; background-color:${ parseInt(value) < 50 ? "#F34723" : parseInt(value) < 90 ?"#FFD700" : parseInt(value) > 90 ? "#50C878" : "" };"> 
                                        //                 ${value}
                                        //             </div>`;
                                        // },
                                        // "groupHeaderColumnTemplate": function (data) {
                                        //     const min = data.f2.average;
                                            
                                        //   return `<div style="text-align: center;color: ${ min < 50 ? "#F34723" : min <= 90 ?"#FFD700" : min > 90 ? "#50C878" : ""} "> ${min}% </div>`;
                                        // }
                                        },
                                        {
                                        "title": "Шлак, т",
                                        // "headerTemplate": '<div style="font-size: 12px; text-align: center; font-weight: bold";><p style="white-space: normal">Шлак, т</p></div>',
                                        "headerAttributes": { "style":"width: 50px"},
                                        "field":"f5",
                                        // "template":  function (data) {
                                        //     const value = data.f3;
                                            
                                        //     return `<div style="text-align: center; background-color:${ parseInt(value) < 50 ? "#F34723" : parseInt(value) < 90 ?"#FFD700" : parseInt(value) > 90 ? "#50C878" : "" };"> 
                                        //                 ${value}
                                        //             </div>`;
                                        // },
                                        //  "groupHeaderColumnTemplate": function (data) {
                                        //     const min = data.f3.average;
                                            
                                        //   return `<div style="text-align: center;color: ${ min < 50 ? "#F34723" : min <= 90 ?"#FFD700" : min > 90 ? "#50C878" : ""} "> ${min}% </div>`;
                                        // }
                                        },
                                        {
                                        "title": "Песок, т",
                                        // "headerTemplate": '<div style="font-size: 12px; text-align: center; font-weight: bold";><p style="white-space: normal">Песок, т</p></div>',
                                        "headerAttributes": { "style":"width: 50px"},
                                        "field":"f6",
                                        // "template":  function (data) {
                                        //     const value = data.f4;
                                            
                                        //     return `<div style="text-align: center; background-color:${ parseInt(value) < 50 ? "#F34723" : parseInt(value) < 90 ?"#FFD700" : parseInt(value) > 90 ? "#50C878" : "" };"> 
                                        //                 ${value}
                                        //             </div>`;
                                        // },
                                        //  "groupHeaderColumnTemplate": function (data) {
                                        //     const min = data.f4.average;
                                            
                                        //     return `<div style="text-align: center;color: ${ min < 50 ? "#F34723" : min <= 90 ?"#FFD700" : min > 90 ? "#50C878" : ""} "> ${min}% </div>`;
                                        // }
                                        },
                                        {
                                        "title": "Шлам, т",
                                        // "headerTemplate": '<div style="font-size: 12px; text-align: center; font-weight: bold";><p style="white-space: normal">Шлам, т</p></div>',
                                        "headerAttributes": { "style":"width: 50px"},
                                        "field":"f7",
                                        // "template":  function (data) {
                                        //     const value = data.f5;
                                            
                                        //     return `<div style="text-align: center; background-color:${ parseInt(value) < 50 ? "#F34723" : parseInt(value) < 90 ?"#FFD700" : parseInt(value) > 90 ? "#50C878" : "" };"> 
                                        //                 ${value}
                                        //             </div>`;
                                        // },
                                        // "groupHeaderColumnTemplate": function (data) {
                                        //     const min = data.f5.average;
                                            
                                        //   return `<div style="text-align: center;color: ${ min < 50 ? "#F34723" : min <= 90 ?"#FFD700" : min > 90 ? "#50C878" : ""} "> ${min}% </div>`;
                                        // }
                                        },
                                        {
                                        "title": "Вода, т",
                                        // "headerTemplate": '<div style="font-size: 12px; text-align: center; font-weight: bold";><p style="white-space: normal">Вода, т</p></div>',
                                        "headerAttributes": { "style":"width: 50px"},
                                        "field":"f7",
                                        // "template":  function (data) {
                                        //     const value = data.f5;
                                            
                                        //     return `<div style="text-align: center; background-color:${ parseInt(value) < 50 ? "#F34723" : parseInt(value) < 90 ?"#FFD700" : parseInt(value) > 90 ? "#50C878" : "" };"> 
                                        //                 ${value}
                                        //             </div>`;
                                        // },
                                        // "groupHeaderColumnTemplate": function (data) {
                                        //     const min = data.f5.average;
                                            
                                        //   return `<div style="text-align: center;color: ${ min < 50 ? "#F34723" : min <= 90 ?"#FFD700" : min > 90 ? "#50C878" : ""} "> ${min}% </div>`;
                                        // }
                                        },
                                        {
                                        "title": "Топливо, т.т/т",
                                        // "headerTemplate": '<div style="font-size: 12px; text-align: center; font-weight: bold";><p style="white-space: normal">Топливо, т.т/т</p></div>',
                                        "headerAttributes": { "style":"width: 50px"},
                                        "field":"f7",
                                        // "template":  function (data) {
                                        //     const value = data.f5;
                                            
                                        //     return `<div style="text-align: center; background-color:${ parseInt(value) < 50 ? "#F34723" : parseInt(value) < 90 ?"#FFD700" : parseInt(value) > 90 ? "#50C878" : "" };"> 
                                        //                 ${value}
                                        //             </div>`;
                                        // },
                                        // "groupHeaderColumnTemplate": function (data) {
                                        //     const min = data.f5.average;
                                            
                                        //   return `<div style="text-align: center;color: ${ min < 50 ? "#F34723" : min <= 90 ?"#FFD700" : min > 90 ? "#50C878" : ""} "> ${min}% </div>`;
                                        // }
                                        },
                                        {
                                        "title": "Элект-во, кВт*ч/т",
                                        // "headerTemplate": '<div style="font-size: 12px; text-align: center; font-weight: bold";><p style="white-space: normal">Элект-во, кВт*ч/т</p></div>',
                                        "headerAttributes": { "style":"width: 50px"},
                                        "field":"f7",
                                        // "template":  function (data) {
                                        //     const value = data.f5;
                                            
                                        //     return `<div style="text-align: center; background-color:${ parseInt(value) < 50 ? "#F34723" : parseInt(value) < 90 ?"#FFD700" : parseInt(value) > 90 ? "#50C878" : "" };"> 
                                        //                 ${value}
                                        //             </div>`;
                                        // },
                                        // "groupHeaderColumnTemplate": function (data) {
                                        //     const min = data.f5.average;
                                            
                                        //   return `<div style="text-align: center;color: ${ min < 50 ? "#F34723" : min <= 90 ?"#FFD700" : min > 90 ? "#50C878" : ""} "> ${min}% </div>`;
                                        // }
                                        },
                                        // {
                                        // "group":{
                                        //       "field": "UnitsInStock", "aggregates": [
                                        //     {
                                        //     "sostav": "999999",
                                        //     "value": "10 tonn",
                                        //     "weightN": "18,5",
                                        //     "weightB": "63",
                                        //     "load": "44.5"
                                        //   }
                                        //     ]
                                        //   }
                                            // }
                                        
                                    ]
                        
                    }

                ],
    //     "dataBound": function (e) {
    //     var grid = this;
    //     $(".k-grouping-row").each(function (e) {
    //         grid.collapseGroup(this);
    //     });
    // }
    }]

    // ---------------- example -----------------------