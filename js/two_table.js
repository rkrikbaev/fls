
// Get stracture from Faceplate CATALOG

function(VARS,element,context){
    
    const folder = 'ASSET'  // folder name equal to template name in fp catalog
    
    const fields = [        // catalog's template fields
        ".name",
        "remains_time",
        "state"
    ].join(",");

    const filter="and(" + [
        `.pattern=$oid('/root/.patterns/${folder}')`,              // 
        `.folder=$oid('/root/PROJECT/CATALOGS/${folder}')`            // 
    ].join(",") + ")";
    
    function _dt(value){
        if (value==="none"){
            value=""
        }else{
            value=moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
        return value;
    }
    function update() {

        context.get_connection().find(`GET ${ fields } from * where ${ filter }`, result=>{
            
            console.log("DEBUG result.set: ",result.set);
            const data=result.set.map(({oid, fields})=>{
                fields.oid=oid;
                fields.dt=_dt(fields.dt);
                fields.dt_start=_dt(fields.dt_start);
                fields.dt_finish=_dt(fields.dt_finish);
                fields.name=fields['.name'];
                return fields;
            });
            
            data.reverse();
            
            // console.log("DEBUG data: ",data);
            // console.log(data.name);
            
            element.set({data});
            
            context.setTimeout(update,5000);
            },error=>{
                context.setTimeout(update,5000);
                console.error(error);
            },10000);
    }
    update();
	return [];
}

// Temprorary solution how to get object's oid from row, to be depricated
// 
function(VARS, element, context) {
    
    const $element=element.get_element(); // faceplate 
    const grid=$element.find('.k-grid').getKendoGrid();
	
    $element.find("tbody").on("click", "tr", function (e) {
	    
        if(typeof context.onOrderSelect==='function'){
	        const $row = $(this);
            const selected = grid.dataItem($row);
            // console.log("DEBUG: selected",selected);
            context.onOrderSelect(selected.oid);
	    }
    });
    
    $element.find("tbody").on("keyup", "tr", function(e) {
	    
        if (typeof context.onOrderSelect === 'function' && e.which == 13) {
        
            const $row = $(this);
            const selected = grid.dataItem($row);
        
            if (selected.comment !== "updated") { 
                const v = (selected.max_quant_pack !== "") ? selected.max_quant_pack : 0;
                context.get_connection().edit_object(selected.oid,{max_quant_pack: v},0,fp_dev.error);
                context.get_connection().edit_object(selected.oid,{comment: "updated"},0,fp_dev.error);
            }
	    }
    });

}


// second table script
// must be placed in events/init

function(VARS,element,context){
    
    function dt(value){
        if (value==="none"){
            value=""
        }else{
            value=moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
        return value;
    }
    
    context.onOrderSelect=oid=>{
        
        const fields = [
            ".name",
            "total_workhours",
            // ----------EXAMPLE--------------
            // "t_taskId",
            // "t_nomenclature",
            // "t_characteristic",
            // "t_quantity",
            // "t_length",
            // "quantity_done",
            // "material_used",
            // "material_defect",
            // "dt_start",
            // "dt_finish",
            // "comment"
            // ----------EXAMPLE--------------
            "state",

        ].join(",");

        const filters=[
            ".pattern=$oid('/root/.patterns/ASSETS')",
            ".folder=$oid('"+oid+"')"
        ].join(",");
        console.log(filters)
        context.get_connection().find(`GET ${ fields } FROM * WHERE AND(${ filters })`,({set})=>{
            const data=set.map(({oid,fields})=>{
                
                fields.oid=oid;
                // ----------EXAMPLE--------------
                // fields.dt_start=dt(fields.dt_start);
                // fields.dt_finish=dt(fields.dt_finish);
                
                // fields.quantity_done=fields.quantity_done==="none"?0:fields.quantity_done;
                // fields.material_used=fields.material_used==="none"?0:fields.material_used;
                // fields.material_defect=fields.material_defect==="none"?0:fields.material_defect;
                
                // fields.count=""+fields.t_quantity+"/"+fields.quantity_done;
                // fields.length=""+fields.t_length+"/"+fields.material_used;
                // ----------EXAMPLE--------------
                fields.name=fields['.name'];
                console.log("DEBUG: fields",fields)
                return fields;
            });
            element.set({data});
        },fp_dev.error,10000);
        
    }
}

// 

// return list of elements from fp objects (CATALOG/TAGS and etc...)
function(VARS,element,context){
   context.get_connection().find("get .name from * where .folder=$oid('/root/PROJECT/CATALOGS/ASSET')",({set})=>{
       const options = set.map(({fields})=>fields[".name"]);
       element.set({options});
   },fp_dev.error, 60000);
   return [];
}





const filter="and(" + [
        `.pattern=$oid('/root/.patterns/${folder}')`,              // 
        `.folder=$oid('/root/PROJECT/CATALOGS/${folder}')`            // 
    ].join(",") + ")";


const element = `folder = $oid('/root/PROJECT/CATALOGS/${catalog}/${folder}')`
    
const folders = ["unit_a", "unit_b", "unit_c"]
const catalog = 'EVENT'

const new_array = folders.map(({folder})=>`folder = $oid('/root/PROJECT/CATALOGS/${catalog}/${folder}')`)