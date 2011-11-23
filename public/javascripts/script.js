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


//------------------------------------------------
// ResultRow
//------------------------------------------------

function ResultRow(d)
{
   this.data = d;
   this.row = this.clone();
   this.panel = new PanelDetails(this.row, d);
   
   this.row.removeClass("result-canevas");
      
   this.row.attr('ena', this.data.ena);
   
   //TODO utiliser le 'attribut ena'
   //this.row.attr('isbn', this.data.isbn);
   this.row.attr('isbn', this.data.ena);
   this.row.find(".result-title").html(this.data.title);
   this.row.find(".result-subtitle").html(this.data.author + ' ' + this.data.year);
   
   this.showProvider();
}

ResultRow.prototype = {
   clone: function()
   {
      return $(".result-canevas").first().clone();
   },   
   insert: function(parent)
   {
      if(this.row)
      {
         this.panel.update();
         parent.append(this.row);
         this.bind();
      }      
   },
   bind: function()
   {
      var $this = this;
      
      // Bind twipsy hover event
      this.row.find('.provider-icon').twipsy();
      
      // Show details
      this.row.find('.open-trigger').click(function()
      {
         $this.panel.togglePanel();
      });

      // Bind tabs
      this.row.find('.tabs').tabs();
   },
   showProvider: function()
   {
      var providers = {
         'google':null, 
         'amazon':null, 
         'library':null
      };
			  
      if(this.data)
      {
         var location;
         for(location in this.data.locations)
         {
            location = this.data.locations[location];
            //console.log(location);
              
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
      
      var providerHTML = "";
      var provider;     
      for(provider in providers)
      {            
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
      }
      this.row.find('.availability').html(providerHTML);
   }
};

//------------------------------------------------
// ResultRow Panel details
//------------------------------------------------

function PanelDetails(row, data)
{
   this.row = row;
   this.data = data;
   this.panel = row.find('.result-details');
}

PanelDetails.prototype = {
   update: function()
   {
      this.uniquingTabs(this.row);
   },  
   togglePanel: function()
   {
      // Show
      if(!this.panel.is(':visible'))
      {
         this.openPanel();
      }
      else
      {
         this.closePanel();
      }
   },
   openPanel: function()
   {
      var self = this;
      this.panel.slideDown('fast');      
      this.row.addClass('open');

      // If data not loaded
      if(!this.panel.attr('loaded'))
      {
         // Start loading
         var $loading = $("#detail-loading");
         $loading.show();

         // Mark as loaded 
         this.panel.attr('loaded', true);

         // Load specific data         
         var url = "/api/get?isbn=" + this.row.attr('isbn');

         $.ajax({
            type: 'GET',
            url: url,
            dataType: "json",    
            success: function(data, status)
            {
               $loading.hide();

               if(data && data.success && data.book)
               {
                 console.dir(data.book);
                 console.log(data.book.description);
                 self.row.find('.detail-resume').html(data.book.description);
               }
               else
               {
            // TODO: Unable to retrieve data
            }
            },
            error: function(XHR, textStatus, errorThrown)
            {
               $loading.hide();
            // TODO: Error message
            }
         });
      } 
   },
   closePanel: function()
   {
      this.panel.slideUp('fast');      
      this.row.removeClass('open');
   }, 
   uniquingTabs: function(row)
   {
      var data = this.data;
      // Unique id for tabs
      this.row.find('.uid').each(function()
      {                  
         $(this).attr('id', data.isbn + '-' + $(this).attr('id'));
      });
       
      // Change the link
      this.row.find('.ulink').each(function()
      {                  
         var href = $(this).attr('href');
         $(this).attr('href', href.replace("#", "#"+ data.isbn +"-"));
      });
   }    
};
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
			  
               var row = new ResultRow(result);
               
               row.insert($resultsList)
            }
		  
            if($resultsList.size() == 0)
            {
               $resultsList.html("<div class='alert-message warning'>" + tr('No result found') + "</div>");
            }           
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
