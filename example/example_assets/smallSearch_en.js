
//*****************************************************************************************		
//This file is used as javascript plugging with the top-header part of small search option
//of new design template, here few document objects name are dependent on the header html text.
//So any change in the header html, should be reviewed in context with this javascript plugging.
//........[sc74193]

//*****************************************************************************************
try{
	//form object defind in the top-header section. [sc74193]
	var oForm = document.getElementById("form-search-location");
	
	//oForm.elements["maplink"].href="http://maps.scotiabank.com/en/";
	document.getElementById("maplink").href="http://maps.scotiabank.com/en/";


	oForm.elements["search-location"].onkeypress = function(e)
	{
		//for IE
		try
		{
			if(window.event.keyCode == 13)
			{
				validatetopAddress();
				return false;
			}
		}
		catch(err) {}
		
		try
		{
			if(e.which == 13)
			{
				validatetopAddress();
				return false;
			}
		}
		catch(err) {}
	}

		var topaddressField = oForm.elements["search-location"];
		//top search implemented [sc74193]
	
		document.getElementById("top-submit").onclick = validatetopAddress;
		//oForm.elements["top-submit"].onclick = validatetopAddress;


		topaddressField.onclick = function() { focusInput(this); }

		function focusInput(input) {
			input.value = "";
			var curClass = input.className.split(" ");
		}

}
catch(e) {} 

//*******************************************************************************
// This script for Google autocomplete functionality for the Canada region
// Canada's Geographic region falls on lat 36, lng -50 NE and lat 85 ,lng -140 SW
// Date: 6th Oct 2011 [sc74193]
//*******************************************************************************
//	var defaultBounds = new google.maps.LatLngBounds(   
//				new google.maps.LatLng(36, -50),
//				new google.maps.LatLng(85, -140));  
//	var input = topaddressField; 
//	var options = {   bounds: defaultBounds };  
//	var autocomplete = new google.maps.places.Autocomplete(input, options);
//
//*******************************************************************************

	//This function call the google map API to generate the lat lng value.
	//And pass all values to result page of branch locator section.[sc74193]

		function validatetopAddress()
		{
			
			var addressField = oForm.elements["search-location"];

			if(!addressField.value) {
			    
				addressField.value  = "Error: Please enter a valid location";
				
				
				return false;
			}
			
			var topgeocoder = new google.maps.Geocoder(); 
			var address     = addressField.value;
			
			topgeocoder.geocode({address: address, region: "CA"}, function(results, status) { 
			if (status == google.maps.GeocoderStatus.OK) { 
			  searchLocationsNear(results[0].geometry.location); 
			} else { 
					addressField.value  = "Error: Unable to find the specified address";
					return false;
				   } 
			});//end of funtion.
			
			function searchLocationsNear(center) { 

				var    topaddress     = escape(addressField.value);
				addressField.value = "";
				
				var url         = "http://maps.scotiabank.com/en/results.php" + "?address=" + topaddress + "&lat=" + center.lat() +"&lng=" + center.lng();
				
				oForm.action = url;
				oForm.submit();
				
				return false;
			}
			return false;
		}
