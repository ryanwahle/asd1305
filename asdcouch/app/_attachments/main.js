/* Ryan Wahle */
/* ASD 1305   */
/* blah blah */

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

	$.couch.db("asd").allDocs({
		success: function(data) {
			//console.log('couch.db.allDocs: ', data);
		
			$.each(data.rows, function(index, showKey) {
				if (showKey.id.substr(0,7) != '_design') {
					//console.log('Found Key/Rev: ', showKey.id, '/', showKey.value.rev);
				
					$.couch.db("asd").openDoc(showKey.id, {
						success: function(tvShow) {
							//console.log('Adding Item: ', tvShow);
						
							$('<a href="#pageAddEditShow">' + tvShow['showTime'] + ' ' + tvShow['showName'] + '</a>')
										.attr ('key', tvShow['_id'])
										.on('click', function () { globalShowKey = tvShow['_id'] })
										.appendTo('#pageMain section ul')
										.wrap('<li></li>')
									;
		
									$('#pageMain section ul').listview('refresh');
									$('#pageMain section h2').hide();
						}
					});
				}
			});
		
		}
	});
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
	
	$('#pageAddEditShow label[for="textshowName"] span.required').hide();
	$('#pageAddEditShow label[for="textTime"] span.required').hide();
	$('#pageAddEditShow label[for="numberDuration"] span.required').hide();
	$('#pageAddEditShow label[for="numberChannel"] span.required').hide();
	$('#pageAddEditShow fieldset[data-role="controlgroup"] span.required').hide();

	$('#pageAddEditShow #checkboxSunday').attr('checked', false).checkboxradio('refresh');
	$('#pageAddEditShow #checkboxMonday').attr('checked', false).checkboxradio('refresh');
	$('#pageAddEditShow #checkboxTuesday').attr('checked', false).checkboxradio('refresh');
	$('#pageAddEditShow #checkboxWednesday').attr('checked', false).checkboxradio('refresh');
	$('#pageAddEditShow #checkboxThursday').attr('checked', false).checkboxradio('refresh');
	$('#pageAddEditShow #checkboxFriday').attr('checked', false).checkboxradio('refresh');
	$('#pageAddEditShow #checkboxSaturday').attr('checked', false).checkboxradio('refresh');

	// Start of Add or Edit
	var tvshowKey = globalShowKey;
	globalShowKey = '';

	$('#pageAddEditShow #storageKey').val(tvshowKey);

	if (tvshowKey) {
		// Edit TV Show
		// Key found!
		$('#pageAddEditShow section h1').text('Edit TV Show');
		$('#pageAddEditShow #buttonDelete').show();
		
		//var tvShow = JSON.parse(localStorage.getItem(tvshowKey));
		var tvShow = [];
		
		$.couch.db("asd").openDoc(tvshowKey, {
			success:	function(data) {
							//console.log('Retrieved data from clouddb');
							//console.log(data.rows);
							//console.log(data);
							
							tvShow = {
								'showName': data.showName,
								'showTime': data.showTime,
								'showDuration': data.showDuration,
								'showChannel': data.showChannel,
								'showDays': data.showDays
							};
							
							$('#textshowName').val(tvShow.showName);	
							$('#textTime').val(tvShow.showTime);
							$('#numberDuration').val(tvShow.showDuration);
							$('#numberChannel').val(tvShow.showChannel);
							
							$.each(tvShow.showDays, function(index, value) {
								//console.log($('#pageAddEditShow input:checkbox[value="1"]'));
								
								//console.log('data.showDays: '+ value);
								
								$('#pageAddEditShow input:checkbox[value="' + value + '"]').attr('checked', true).checkboxradio('refresh');
								
								//$('#pageAddEditShow #checkboxMonday').click().checkboxradio('refresh');
							});	
							
							//$('#pageAddEditShow ').trigger('refresh');
							
							//console.log('tvShow: ' , tvShow);
						},
					
			error:		function(error) {
							console.log('Error retrieving clouddb records: ', error.statusText);
						}
		});
		
		
		//console.log('1');	
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
		
		$.couch.db("asd").openDoc($('#pageAddEditShow #storageKey').val(), {
			success:	function(data) {
							var doc = {
								_id: data['_id'],
								_rev: data['_rev']
							};

							$.couch.db("asd").removeDoc(doc, {
								success: function(data) {
									console.log(data);
								},
			
								error: function(status) {
									console.log(status);
								}
							});

						},
					
			error:		function(error) {
						console.log('Error retrieving clouddb records: ', error.statusText);
						}
		});


		
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
	
	$('#pageAddEditShow label[for="textshowName"] span.required').hide();
	$('#pageAddEditShow label[for="textTime"] span.required').hide();
	$('#pageAddEditShow label[for="numberDuration"] span.required').hide();
	$('#pageAddEditShow label[for="numberChannel"] span.required').hide();
	$('#pageAddEditShow fieldset[data-role="controlgroup"] span.required').hide();
	
	var validationError = false;
	if ($('#pageAddEditShow #textshowName').val().trim() == '') {
		$('#pageAddEditShow label[for="textshowName"] span.required').show();
	
		console.log('Validation Error: TV Show Name');
		validationError = true;
	}

	if ($('#pageAddEditShow #textTime').val().trim() == '') {
		$('#pageAddEditShow label[for="textTime"] span.required').show();

		console.log('Validation Error: Time');
		validationError = true;
	}

	if ($('#pageAddEditShow #numberDuration').val().trim() == '') {
		$('#pageAddEditShow label[for="numberDuration"] span.required').show();

		console.log('Validation Error: Duration');
		validationError = true;
	}
	
	if ($('#pageAddEditShow #numberChannel').val().trim() == '') {
		$('#pageAddEditShow label[for="numberChannel"] span.required').show();

		console.log('Validation Error: Channel');
		validationError = true;
	}
		
	if ($('#pageAddEditShow input:checkbox:checked').length == 0) {
		$('#pageAddEditShow fieldset[data-role="controlgroup"] span.required').show();

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
	
	console.log( tvShow );
	
	// Check to see if this is a new TV Show or editing a TV Show
	if ($('#pageAddEditShow #storageKey').val() == '') {
		$.couch.db("asd").saveDoc(tvShow, {
			success:	function(data) {
							console.log(data);
						},
			error:		function(error) {
							console.log(error);
						}
		});
	} else {
		$.couch.db("asd").openDoc($('#pageAddEditShow #storageKey').val(), {
				success:	function(data) {
								tvShow['_id'] = data['_id'];
								tvShow['_rev'] = data['_rev'];

								$.couch.db("asd").saveDoc(tvShow, {
									success: function(data) {
										console.log(data);
									},
			
									error: function(status) {
										console.log(status);
									}
								});

							},
					
				error:		function(error) {
								console.log('Error retrieving clouddb records: ', error);
							}
			});
	}
});