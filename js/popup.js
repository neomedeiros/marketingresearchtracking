$(function() {  
  var pluginEnabledCheckbox = $('input[type="checkbox"]');

  pluginEnabledCheckbox.change(function() {
    $('.trackingStatusLabel').empty();
    if (pluginEnabledCheckbox.checked) {            
      pluginEnabledCheckbox.checked = false;          
      $('.trackingStatusLabel').removeClass('trackingStatusLabelOn');
      $('.trackingStatusLabel').addClass('trackingStatusLabelOff');
      $('.trackingStatusLabel').append('Off');
    } else {            
      pluginEnabledCheckbox.checked = true;      
      $('.trackingStatusLabel').removeClass('trackingStatusLabelOff');
      $('.trackingStatusLabel').addClass('trackingStatusLabelOn');
      $('.trackingStatusLabel').append('On');
    }

    console.log('set value for plugin enabled variable: '+ pluginEnabledCheckbox.checked.toString());
    setLocalValueStorage("optinPluginEnabled",pluginEnabledCheckbox.checked.toString());
  });

  getLocalValueStorage("optinPluginEnabled", function(result) {

    console.log('optin plugin enabled check: ' + result.optinPluginEnabled);

    if (result.optinPluginEnabled == "true")
      pluginEnabledCheckbox.trigger("click");
  });    
});
