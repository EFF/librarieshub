//------------------------------------------------
// Internationalization
//------------------------------------------------
$.tr.dictionary(dictionnary);

// TODO: Manage language selection
var lg = 'fr';

// 2. Language selection.
$.tr.language(lg, false);

// 3. shortcut
var tr = $.tr.translator();

// Stuff to do when dom ready
$(function()
{
   // Translate static string
   $('.translate').each(function()
   {
      var index = $(this).html();
		
      $(this).html(tr(index));
   });
});

//------------------------------------------------
// Search form
//------------------------------------------------
$('#form_search').submit(function(e)
{
   var $resultsList = $('div#results-list');
   var $resultsLoading = $("#results-loading");
   
   var url = '/api/search?s=' + $("#keywords").val();
  
   // Geolocalisation
   if($.cookie('coords-latitude')) url += '&lat=' + $.cookie('coords-latitude');
   if($.cookie('coords-longitude')) url += '&long=' + $.cookie('coords-longitude');
  
   // Show loading
   $resultsLoading.show();
   $resultsList.html("");
  
   // TODO: Remove
   url = 'dummy-search.json';
  
   $.ajax({
      type: 'GET',
      url: url,
      dataType: "json",    
      success: function(data, status)
      {
         // Hide loading
         $resultsLoading.hide();
	  
         if(data && data.success && data.results)
         {
                       
            var item;
            
            // We emptied the list
            $resultsList.html("");
		  
            for(item in data.results)
            {
               var result = data.results[item];               
			  
               var providers = {
                  'google':null, 
                  'amazon':null, 
                  'library':null
               };
			  
               if(result.locations)
               {
                  var location;
                  for(location in result.locations)
                  {
                     location = result.locations[location];
              
                     if(location.type)
                     {
                        switch(location.type)
                        {
                           case 'webStore':
                              if(location.name)
                              {
                                 switch(location.name)
                                 {
                                    case 'Amazon':
                                       console.dir(result);
                                       if(location.price && location.price.amount) 
                                       {
                                          var amount = location.price.amount.substr(0, location.price.amount.length - 2) + '.' + location.price.amount.substr(location.price.amount.length - 2, 2);
                                          var obj = {
                                             msg:tr('Best price on Amazon : $&1', Number(amount).toFixed(2)),
                                             url: "http://www.amazon.com/"
                                          };
                                          if(location.link){
                                             obj.url = location.link; 
                                          }
                                          providers['amazon'] = obj;
                                       }
                                       else
                                       {
                                          var obj = {
                                             msg:tr('Best price on Amazon : N/A'),
                                             url: "http://www.amazon.com/"
                                          };
                                          if(location.link){
                                             obj.url = location.link; 
                                          }
                                          providers['amazon'] = obj;
                                       }
                                       break;
                                    case 'Google':
                                       providers['google'].msg = tr('Available on Google Book');
                                       break;
                                 }
                              }
                              break;
                    
                           case 'library':
                              if(location.name && location.distance)
                              {
                                 var obj = {
                                    msg:tr('Available at &1 library (&2 km)', location.name, location.distance)
                                 };
                                 providers["library"] = obj;
                              }
                              else if(location.name)
                              {
                                 var obj = {
                                    msg:tr('Available at &1 library', location.name)
                                 };
                                 providers["library"] = obj;
                              }
                              break;
                        }
                     }
                  }
               }
			  
               // Result line
               var $result = $(".result-canevas").first();
               console.log($result.size());
          
               $result.removeClass(".result-canevas");
               $result.attr('isbn', result.isbn);
               $result.find(".result-title").html(result.title);
               $result.find(".result-subtitle").html(result.author + ' ' + result.year);
				  
               var provider;          
               for(provider in providers)
               {
                  var providerHTML = "";
             
                  var providerText = false;
                  if(providers[provider] && providers[provider].msg)
                  {
                     providerText = providers[provider].msg;
                  }
			  		
                  providerHTML += '<div class="span1">';
		
                  // Active provider
                  if(providerText)
                  {	
                     if(providers[provider].url) providerHTML += '<a target="_blank" href='+providers[provider].url+'>';
                     providerHTML += '<span class="provider-icon '+provider+' active" title="'+providerText+'"></span>';	
                     if(providers[provider].url) providerHTML += '</a>';				  	
                  }
                  // Deactivate provider
                  else
                  {
                     providerHTML += '<span class="provider-icon '+provider+'"></span>';			  	
                  }
			  		
                  providerHTML += '</div>';  
           
                  $result.find('.availability').html(providerHTML);
               }
				 
               // Add to the result list
               $resultsList.append($result);
            }
		  
            if($resultsList.size() == 0)
            {
               $resultsList.html("<div class='alert-message warning'>" + tr('No result found') + "</div>");
            }
		  
            // Bind twipsy hover event
            $('.provider-icon', $("div#results")).twipsy();
         }
         else
         {
            // Parse error
            $resultsList.html("<div class='alert-message error'>" + tr('Server error') +"</div>");
         }
      },
      error: function(XHR, textStatus, errorThrown)
      {
         // Hide loading
         $resultsLoading.hide();
  	  	
         // TODO: Show human-readable message  	  	
         // Show error message
         $resultsList.html("<div class='alert-message error'>" + textStatus + "</div>");
      }
   });
  
   return false;
});

// ------------------------------------------------
// Geolocalisation
// ------------------------------------------------

// Check if the position is in cookies
if(!$.cookie('coords-latitude') || !$.cookie('coords-longitude'))
{
   // If client support HTML5 Geolocation
   if (navigator.geolocation) 
   {
      var callbackSuccess = function callbackSuccess(position)
      {
         $.cookie('coords-latitude', position.coords.latitude, {
            expires: 1
         });
         $.cookie('coords-longitude', position.coords.longitude, {
            expires: 1
         });
      };
      navigator.geolocation.getCurrentPosition(callbackSuccess, null);
   }
}
