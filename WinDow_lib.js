/*
 *                       /\_/\
 *                      / - - \
 *                     <_  X  _>  /\_/\
 *                     /       \ <_o_o_>
 *                    <_)_U_U_(_>
 *
 * @author WinDow
 * @date
 */

/**
 * Represents a search trough an array.
 * @function search
 * @param {Array} array - The array you wanna search trough
 * @param {string} key - The key/value to search for
 * @param {string} [prop] - The property name to find it in
 */

module.exports.Array_search = function Array_search(array, key, prop){
    // Optional, but fallback to key['name'] if not selected
    prop = (typeof prop === 'undefined') ? 'name' : prop;

    for (var i=0; i < array.length; i++) {
        if (array[i][prop] === key) {
            return array[i];
        }
    }
};

module.exports.Array_remove = function Array_remove(array, key, prop){
    // Optional, but fallback to key['name'] if not selected
    prop = (typeof prop === 'undefined') ? 'name' : prop;

    for (var i=0; i < array.length; i++) {
        if (array[i][prop] === key) {
            array.splice(i-1,1);
        }
    }
};

/**
 * Represents a search trough an array.
 * @function nested search
 * @param {Array} array - The array you wanna search trough
 * @param {string} key - The key/value to search for
 * @param {Array} prop1 - The object to find it in
 * @param {string} [prop2] - The property name to find it in
 */
 
module.exports.Array_nestedSearch = function Array_nestedSearch(array, key, prop1,prop2){
    // Optional, but fallback to key['name'] if not selected
    prop2 = (typeof prop2 === 'undefined') ? 'name' : prop2;

    for (var i=0; i < array.length; i++) {
		for (var j=0;j<prop1.length;j++) {
			if (array[i][prop1[j]][prop2] === key) {
				return array[i];
			}
		}
    }
};

module.exports.Array_nestedRemove = function Array_nestedRemove(array, key, prop1,prop2){
    // Optional, but fallback to key['name'] if not selected
    prop2 = (typeof prop2 === 'undefined') ? 'name' : prop2;

    for (var i=0; i < array.length; i++) {
        for (var j=0;j<prop1.length;j++) {
            if (array[i][prop1[j]][prop2] === key) {
                array.splice(i-1,1);
            }
        }
    }
};

module.exports.Array_shuffle = function Array_shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
};