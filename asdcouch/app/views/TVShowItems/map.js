function (doc) {
	if (doc._id.substr(0,7) === "_design") {
		emit(doc._id);
	}
}