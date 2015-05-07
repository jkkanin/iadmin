angular.module('config').
    filter('exclude', function() {
        return function(allCollection, excludedCollection, compare) {

            var returnCollection = [];
            if (!allCollection || !excludedCollection) {
                return returnCollection;
            }
            allCollection.forEach(function(model) {

                var exist = false;
                excludedCollection.forEach(function(excludedModel) {
                    if (excludedModel[compare[1]] == model[compare[0]]) {
                        exist = true;
                    }
                });
                if (!exist) {
                    returnCollection.push(model);
                }
            });
            return returnCollection;
        }
})
.filter('LimitCharacter', function() {
	return function(input) {
		
		if (input && input.length > 35)
			return input.substr(0, 32) + '...';
		else
			return input;
	};
})
.filter('ConvertDate', function() {
	return function(input) {
		
		var tmpdate = new Date(input);
        return ((tmpdate.getMonth() + 1) + "/" + tmpdate.getDate() + "/" + tmpdate.getFullYear());
	};
});