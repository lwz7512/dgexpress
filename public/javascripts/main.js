/*
 * main logic module for demo page
 * 2014/02/10
 */

 (function(){

    $(document).ready(readyHandler);

    function readyHandler(){

        console.log(">>> to add interactive actions!");

            //------------- Treemap demo --------------------------------
            $('#load_Treemap_Json').click(function(){//load json
                console.log("to loadTreemapJson...");
                $.get('/templates/flare.json', function(data){
                    //console.log(data);
                    $('#Treemap_JsonData').val(JSON.stringify(data,null,4));
                    $('#Treemap_loading').toggle();
                });
                $('#Treemap_loading').toggle();
            });
            $('#submit_Treemap_Form').click(function(){//form post
                var json = $('#Treemap_JsonData').val();
                var valid = checkJsonValid(json);
                if(valid){
                    $.post('/create', {json: json, charttype: 'treemap'}, function(data){
                        //alert("Success!");
                        var result = JSON.parse(data);
                        $('#Treemap_result').empty().append(data);
                        $('#Treemap_result').append('&nbsp;&nbsp;>>>&nbsp;&nbsp;<a href="'+result.url+'" target="_blank">View it!</a>');
                        $('#Treemap_loading').toggle();
                    });
                }
                $('#Treemap_loading').toggle();
            });
            
            //--------------- RadialTree -------------------------------


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