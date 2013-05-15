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
	// Display TV Shows == today && >= whatTimeIsItNow

	// Set the correct date on the page
	var namesMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
					'October', 'November', 'December'];

	var todayDate = new Date();

	$('#pageMain section h1').text('Today is ' + namesDay[todayDate.getDay()] 
									+ ', ' + namesMonth[todayDate.getMonth()] 
									+ ' ' + todayDate.getDate());

	$('#pageMain section ul').empty();
	$('#pageMain section h2').show();
	
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
	
	if ($('#pageAddEditShow #storageKey').val() == '') {
		localStorage.setItem( Math.floor(Math.random()*10000000001), JSON.stringify(tvShow) );
	} else {
		localStorage.setItem($('#pageAddEditShow #storageKey').val(), JSON.stringify(tvShow));
	}
});