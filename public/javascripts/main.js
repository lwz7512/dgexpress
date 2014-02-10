/*
 * main logic module for demo page
 * 2014/02/10
 */

 (function(){

    $(document).ready(readyHandler);

    function readyHandler(){

        console.log(">>> to add interactive actions!");

            //------------- treemap demo --------------------------------
            $('#loadTreemapJson').click(function(){

                console.log("to loadTreemapJson...");
                $.get('/templates/flare.json', function(data){
                    //console.log(data);
                    $('#TreemapJsonData').val(JSON.stringify(data,null,4));
                    $('#treemap_loading').toggle();
                });
                $('#treemap_loading').toggle();
            });
            $('#submitTreemapForm').click(function(){
                var json = $('#TreemapJsonData').val();
                var valid = checkJsonValid(json);
                if(valid){
                    $.post('/create', {json: json, charttype: 'treemap'}, function(data){
                        //alert("Success!");
                        var result = JSON.parse(data);
                        $('#treemap_result').empty().append(data);
                        $('#treemap_result').append('&nbsp;&nbsp;>>>&nbsp;&nbsp;<a href="'+result.url+'" target="_blank">View it!</a>');
                        $('#treemap_loading').toggle();
                    });
                }
                $('#treemap_loading').toggle();
            });
            
            //----------------------------------------------


            //------ common function ----------------------------
            function checkJsonValid(json){
                if(json.length==0){
                    alert("load json first!");
                    return false;
                }
                
                try{
                    JSON.parse(json);
                }catch(err){
                    console.error("Parse json error: "+err);
                    alert("json parse error!");
                    return false;
                }
              
                return true;
            }
            //------ end of common function ---------------------

    } //end of readyHandler

 }());