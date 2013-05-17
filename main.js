/* Ryan Wahle */
/* ASD 1305   */

var namesDay =['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var globalShowKey = '';

$('#pageMain').on('pageinit', function() {
	// pageinit only initializes once. 
	// Using pagebeforeshow instead.
});

$('#pageMain').on('pagebeforeshow', function() {
	// See if there is data in localStorage.
	// If not, then ask user which data they would like to load.
	
	// Set the correct date on the page
	var namesMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
					'October', 'November', 'December'];

	var todayDate = new Date();

	$('#pageMain section h1').text('Today is ' + namesDay[todayDate.getDay()] 
									+ ', ' + namesMonth[todayDate.getMonth()] 
									+ ' ' + todayDate.getDate());

	$('#pageMain section ul').empty();
	$('#pageMain section h2').show();
	
	$('#pageMain a[href="#popupImportData"]').hide();
	
	if (localStorage.length == 0) {
		$('#pageMain a[href="#popupImportData"]').click();
	} else {
		// Setup listview if there is any local storage
		$.each (localStorage, function(index) {
			// Display each item on main screen.
			var tvShow = JSON.parse( localStorage.getItem( index ) );

			$('<a href="#pageAddEditShow">' + tvShow.showTime + ' ' + tvShow.showName + '</a>')
				.attr ('key', index)
				.on('click', function () { globalShowKey = index })
				.appendTo('#pageMain section ul')
				.wrap('<li></li>')
			;
		
			$('#pageMain section ul').listview('refresh');
			$('#pageMain section h2').hide();
		});
	}
});

$('#pageMain #buttonImportJSON').on('click', function() {
	console.log('Trying to import JSON');
	
	$.ajax({    
		url: 		'data.json',    
		type: 		'GET',    
		dataType: 	'json',    
		
		success:	function(data) {        
						//console.log('ajax results: ', data); 
						
						$.each(data, function(index, tvShow) {
							//console.log(value);
							localStorage.setItem( Math.floor(Math.random()*10000000001), JSON.stringify(tvShow) );
						});
					},
		
		error: 		function(error) {
				   		console.log('Error loading JSON: ', error.statusText);
				   	}	
	});
});

$('#pageMain #buttonImportXML').on('click', function() {
	console.log('Trying to import XML');
	
	$.ajax({
		url:		'data.xml',
		type:		'GET',
		dataType: 	'xml',
		
		success:	function(data) {
						$(data).find('tvshow').each(function() {
							//console.log(tvShow);
							
							var tvShowDays = [];	
							$(this).find('day').each(function() {
								//console.log('Pushing: ' + $(this).text());
								tvShowDays.push($(this).text());
							});
							
							console.log(tvShowDays);
							
							var tvShow = {
								'showName': $(this).find('showName').text(),
								'showTime': $(this).find('showTime').text(),
								'showDuration': $(this).find('showDuration').text(),
								'showChannel': $(this).find('showChannel').text(),
								'showDays': tvShowDays
							};
	
							localStorage.setItem( Math.floor(Math.random()*10000000001), JSON.stringify(tvShow) );
						});
					},
					
		error:		function(error) {
						console.log('Error loading XML: ', error.statusText);
					}
	});
});
	
$('#pageAddEditShow').on('pagebeforeshow', function(e, data) {
	// See if there is a key associated with this click.
	// If there is a key, then load show data and change form to represent edit form
	// If no key, then change form to represent add form

	// Grab the global key and store in local variable.
	// Immediately set global key to blank so no confusion later
	
	// jQuery seems to keep the previous values so set blank.
	$('#textshowName').val('');
	$('#textTime').val('');
	$('#numberDuration').val('');
	$('#numberChannel').val('');
	
	$('#pageAddEditShow input:checkbox:checked').each(function() {
		$(this).click();
	});

	$('#pageAddEditShow label[for="textshowName"] span').hide();
	$('#pageAddEditShow label[for="textTime"] span').hide();
	$('#pageAddEditShow label[for="numberDuration"] span').hide();
	$('#pageAddEditShow label[for="numberChannel"] span').hide();
	$('#pageAddEditShow fieldset[data-role="controlgroup"] legend span').hide();

	// Start of Add or Edit
	var tvshowKey = globalShowKey;
	globalShowKey = '';

	$('#pageAddEditShow #storageKey').val(tvshowKey);

	if (tvshowKey) {
		// Edit TV Show
		// Key found!
		$('#pageAddEditShow section h1').text('Edit TV Show');
		$('#pageAddEditShow #buttonDelete').show();
		
		var tvShow = JSON.parse(localStorage.getItem(tvshowKey));
		
		$('#textshowName').val(tvShow.showName);	
		$('#textTime').val(tvShow.showTime);
		$('#numberDuration').val(tvShow.showDuration);
		$('#numberChannel').val(tvShow.showChannel);

		$.each(tvShow.showDays, function(index, value) {
			//console.log($('#pageAddEditShow input:checkbox[value="1"]'));
			$('#pageAddEditShow input:checkbox[value="' + value + '"]').click();
		});	
	
	} else {
		// Add TV Show
		// No key found!
		$('#pageAddEditShow section h1').text('Add TV Show');
		$('#pageAddEditShow #buttonDelete').hide();
	}
});

$('#pageAddEditShow #buttonDelete').on('click', function() {
	if ( confirm('Are you sure you want to delete this TV Show from your reminder list?') ) {
		// User click OK
		//console.log($('#pageAddEditShow #storageKey').val());
		localStorage.removeItem($('#pageAddEditShow #storageKey').val());
	} else {
		// User clicked canceled
		return false;
	}
});

$('#pageAddEditShow #buttonSave').on('click', function() {
	/* For testing and reference
	console.log(
	
		$('#textshowName').val(),
		$('#textTime').val(),
		$('#numberDuration').val(),
		$('#numberChannel').val()
		
	);
	*/
	
	// First Validate
	
	$('#pageAddEditShow label[for="textshowName"] span').hide();
	$('#pageAddEditShow label[for="textTime"] span').hide();
	$('#pageAddEditShow label[for="numberDuration"] span').hide();
	$('#pageAddEditShow label[for="numberChannel"] span').hide();
	$('#pageAddEditShow fieldset[data-role="controlgroup"] legend span').hide();
	
	var validationError = false;
	if ($('#pageAddEditShow #textshowName').val().trim() == '') {
		$('#pageAddEditShow label[for="textshowName"] span').show();
	
		console.log('Validation Error: TV Show Name');
		validationError = true;
	}

	if ($('#pageAddEditShow #textTime').val().trim() == '') {
		$('#pageAddEditShow label[for="textTime"] span').show();

		console.log('Validation Error: Time');
		validationError = true;
	}

	if ($('#pageAddEditShow #numberDuration').val().trim() == '') {
		$('#pageAddEditShow label[for="numberDuration"] span').show();

		console.log('Validation Error: Duration');
		validationError = true;
	}
	
	if ($('#pageAddEditShow #numberChannel').val().trim() == '') {
		$('#pageAddEditShow label[for="numberChannel"] span').show();

		console.log('Validation Error: Channel');
		validationError = true;
	}
		
	if ($('#pageAddEditShow input:checkbox:checked').length == 0) {
		$('#pageAddEditShow fieldset[data-role="controlgroup"] legend span').show();

		console.log('Validation Error: Day of the week');
		validationError = true;
	}

	if (validationError) {
		return false;
	}

	
	
	// Save Data
	
	var tvShowDays = [];
	$('#pageAddEditShow input:checkbox:checked').each(function() {
			//console.log( namesDay[$(this).val()] );
			tvShowDays.push( $(this).val() );
	});
	
	
	var tvShow = {
		'showName': $('#textshowName').val(),
		'showTime': $('#textTime').val(),
		'showDuration': $('#numberDuration').val(),
		'showChannel': $('#numberChannel').val(),
		'showDays': tvShowDays
	};
	
	//console.log( tvShow );
	
	// Check to see if this is a new TV Show or editing a TV Show
	if ($('#pageAddEditShow #storageKey').val() == '') {
		localStorage.setItem( Math.floor(Math.random()*10000000001), JSON.stringify(tvShow) );
	} else {
		localStorage.setItem($('#pageAddEditShow #storageKey').val(), JSON.stringify(tvShow));
	}
});