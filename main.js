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
	var tvshowKey = globalShowKey;
	globalShowKey = '';

	// NOTE: NOT SURE HOW TO IMPLEMENT KEY YET, SO THIS IS ALL ONLY FOR ADDING
	$('#pageAddEditShow section h1').text('Add TV Show');
	$('#pageAddEditShow #buttonDelete').hide();
	
	console.log ('key: ' + tvshowKey);
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
	$('input:checkbox:checked').each(function() {
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
	
	localStorage.setItem( Math.floor(Math.random()*10000000001), JSON.stringify(tvShow) );	
});