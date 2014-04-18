App.factory('RedisService', ['$http', '$angularCacheFactory', 'config', 
    function($http, cacheFactory, config) {
        if (config.cache) {
            var keySearchCache = cacheFactory('keySearchCache', 
                { 
                    maxAge: 10 * 60 * 1000,
                    deleteOnExpire: 'passive'
                }
            );
        }
        else {
            var keySearchCache = false;
        }
        
        var service = {
            
            /**
             * Server API calls
             */
            
            getServers: function() {
                return $http.get(
                    config.apiUri + 'server/list',
                    {
                        cache: config.cache
                    }
                );
            },

            getServerDBs: function(serverId) {
                return $http.get(
                    config.apiUri + 'server/' + serverId + '/databases',
                    {
                        cache: config.cache
                    }
                );
            },
            
            getServerInfo: function(serverId) {
                return $http.get(
                    config.apiUri + 'server/' + serverId + '/info', 
                    {
                        cache: config.cache
                    }
                );
            },
            
            getServerClients: function(serverId, nocache) {
                return $http.get(
                    config.apiUri + 'server/' + serverId + '/clients', 
                    {
                        cache: nocache ? false : config.cache
                    }
                );
            },
            
            /**
             * keys API calls
             */
            
            searchKeys: function(serverId, dbId, pattern, page) {
                return $http.get(
                    config.apiUri + 'server/' + serverId + '/db/' + dbId + '/keys/search', 
                    {
                        params: {
                            pattern: pattern,
                            // backend pagination starts from 0, frontend from 1
                            page: page > 0 ? page-1 : 0
                        },
                        cache: keySearchCache
                    }
                );
            },
            
            getKeyValue: function(serverId, dbId, key) {
                return $http.get(
                    config.apiUri + 'server/' + serverId + '/db/' + dbId + '/keys/value', 
                    {
                        params: {
                            key: key
                        },
                        cache: keySearchCache
                    }
                );
            },
            
            deleteKeys: function(serverId, dbId, keys) {
                return $http.post(
                    config.apiUri + 'server/' + serverId + '/db/' + dbId + '/keys/delete', 
                    {
                        keys: keys
                    }
                ).then(function(response) {
                    if (angular.isObject(keySearchCache)) {
                        keySearchCache.removeAll();
                    }
                    return response;
                });
            },    
            
            editKeyAttributes: function(serverId, dbId, keyName, attributes) {
                return $http.post(
                    config.apiUri + 'server/' + serverId + '/db/' + dbId + '/keys/attrs', 
                    {
                        key: keyName,
                        attributes: attributes
                    }
                ).then(function(response) {
                    if (angular.isObject(keySearchCache)) {
                        keySearchCache.removeAll();
                    }
                    return response;
                });
            },
            
            editKey: function(serverId, dbId, key) {
                return $http.post(
                    config.apiUri + 'server/' + serverId + '/db/' + dbId + '/keys/edit', 
                    {
                        key: key
                    }
                ).then(function(response) {
                    if (angular.isObject(keySearchCache)) {
                        keySearchCache.removeAll();
                    }
                    return response;
                });
            },
            
            addKey: function(serverId, dbId, key) {
                return $http.post(
                    config.apiUri + 'server/' + serverId + '/db/' + dbId + '/keys/add', 
                    {
                        key: key
                    }
                ).then(function(response) {
                    if (angular.isObject(keySearchCache)) {
                        keySearchCache.removeAll();
                    }
                    return response;
                });
            }

        };
        
        return service;
    }
]);