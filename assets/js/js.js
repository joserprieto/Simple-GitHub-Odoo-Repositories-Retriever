/**
 * Created by joserprieto on 30/10/2015.
 */

/**
 * Namespace definition:
 */
var joserprieto = joserprieto || {};
joserprieto.RepositoriesCollector = joserprieto.RepositoriesCollector || {};

/**
 * UserFinder class
 *
 * Class for recover information from Github, about repositories of an user
 *
 */
joserprieto.RepositoriesCollector.UserFinder = (function(){
    /**
     * Private var oSingletonInstance
     *
     * stores a reference to the Singleton:
     */
    var oSingletonInstance;
    /**
     * Private method SingletonConstructor
     *
     * @returns {{getUserID: Function, searchByUserName: Function, getUserName: Function, getOrganizationID: Function, getOrganizationName: Function, getCurrentPage: Function, getCurrentRequestURL: Function}}
     * @constructor
     */
    function SingletonConstructor() {
        // Private methods and variables:
        /**
         * Private variables:
         */
        var sAPIBaseUrl                 = 'https://api.github.com';
        var sAPIrequestUser             = '/users/:username';
        var sAPIrequestOrganization     = '/orgs/:org';
        var sAPIrequestReposByUsername  = '/users/:username/repos';
        var sAPIrequestReposByUserID    = '/user/:userid/repos';
        var sAPIrequestReposByOrgname   = '/orgs/:org/repos';
        var sAPIrequestReposByOrgID     = '/org/:orgid/repos';
        var iUserID                     = null;
        var sUserName                   = null;
        var iOrganizationID             = null;
        var sOrganizationName           = null;
        var iCurrentPage                = null;
        var sCurrentRequestUrl          = null;
        var jqXHR                       = null;
        var oEvntFuncPlaceholder        =
        {
            onSearchByUserBeforeStart   :   null,
            onSearchByUserSuccess       :   null,
            onSearchByUserFails         :   null
        };
        /**
         * Private methods:
         */

        //var _onSearchByUserBeforeStart    =   function(xhr)  {
            /*
            joserprieto.RepositoriesCollector.Repositories.getInstance().resetAll();
            joserprieto.RepositoriesCollector.Repositories.getInstance().setAuthor(
                data.id, data.login, data.url, data.html_url, data.type, data.name, data.company, data.blog, data.bio, data.public_repos
            );
            //console.log(joserprieto.RepositoriesCollector.Repositories.getInstance().getAuthor());
            if (joserprieto.RepositoriesCollector.Repositories.getInstance().getAuthor())   {
                joserprieto.RepositoriesCollector.Repositories.getInstance().fetchRepos();
            }
            //joserprieto.RepositoriesCollector.Repositories.getInstance().getReposByUser()
            */

        //};//    /end of Private method _onSearchByUserBeforeStart

        /**
         * Private method _searchByUserName
         * @param sUserName
         * @private
         */
        var _searchByUserName   =   function(sUserName) {
            //console.log('searchByUserName');
            var sUrlSearchUser  = sAPIBaseUrl + sAPIrequestUser;
            sUrlSearchUser      = sUrlSearchUser.replace(':username', sUserName);
            sCurrentRequestUrl  = sUrlSearchUser;
            iUserID             = -1;
            //console.log(sUrlSearchUser);//var sText = 'Buscando el usuario: ' + sUser;//console.log(sText);
            jqXHR =
                $.ajax(
                    {
                        method      :   "GET",
                        url         :   sUrlSearchUser,
                        dataType    :   'json',
                        beforeSend  :   function(xhr)   {
                            if (oEvntFuncPlaceholder.onSearchByUserBeforeStart)   {
                                oEvntFuncPlaceholder.onSearchByUserBeforeStart.call(this, xhr);
                            }
                        }
                    })

                    .done(_onSearchByUserNameJqXHRDone)
                    .fail(_onSearchByUserNameJqXHRFail);
        };//    /end of Private method _searchByUserName
        /**
         * Private method _onSearchByUserNameJqXHRDone
         * @param data
         * @param textStatus
         * @param jqXHR
         * @private
         */
        var _onSearchByUserNameJqXHRDone =   function(data, textStatus, jqXHR)  {
            //console.log('onSearchByUserNameDone(data, textStatus, jqXHR)');
            iUserID         = data.id;
            iOrganizationID = null;
            iCurrentPage    = 0;
            if  (oEvntFuncPlaceholder.onSearchByUserSuccess)    {
                oEvntFuncPlaceholder.onSearchByUserSuccess.call(this, data, textStatus, jqXHR)
            }
        };//    /end of Private method _onSearchByUserNameJqXHRDone
        /**
         * Private method _onSearchByUserNameJqXHRFail
         * @param jqXHR
         * @param textStatus
         * @param errorThrown
         * @private
         */
        var _onSearchByUserNameJqXHRFail    =   function(jqXHR, textStatus, errorThrown)  {
            //console.log('onSearchByUserNameFail(jqXHR, textStatus, errorThrown)');
            iUserID         = null;
            iOrganizationID = null;
            iCurrentPage    = null;
            if  (oEvntFuncPlaceholder.onSearchByUserFails)    {
                oEvntFuncPlaceholder.onSearchByUserFails.call(this, jqXHR, textStatus, errorThrown)
            }
        };//    /Private method _onSearchByUserNameJqXHRFail

        return {
            // Public methods and variables
            /**
             * Public method getUserID
             *
             * @returns {integer}   iUserID
             */
            getUserID: function () {
                return iUserID;
            },//    /end public method getUserID
            /**
             * Public method getUserName
             *
             * @returns {string}    sUserName
             */
            getUserName: function () {
                return sUserName;
            },//    /end public method getUserName
            /**
             * Public method getOrganizationID
             *
             * @returns {integer}   iOrganizationID
             */
            getOrganizationID: function () {
                return iOrganizationID;
            },//    /end public method getOrganizationID
            /**
             * Public method getOrganizationName
             *
             * @returns {string} sOrganizationName
             */
            getOrganizationName: function () {
                return sOrganizationName;
            },//    /end public method getOrganizationName
            /**
             * Public method getCurrentRequestURL
             *
             * @returns {*}
             */
            getCurrentRequestURL: function () {
                return sCurrentRequestUrl;
            },// /end public method getCurrentRequestURL
            /**
             * Public method searchByUserName
             *
             * @param sUserName
             */
            searchByUserName: function(sUserName)    {
                _searchByUserName(sUserName);
            },//    /end Public method searchByUserName
            /**
             * Public method on
             *
             * @param sEventName
             * @param fFunction
             */
            on: function(sEventName, fFunction) {
                switch (sEventName) {
                    case 'UserSearchStart':
                        oEvntFuncPlaceholder.onSearchByUserBeforeStart  = fFunction;
                        break;
                    case 'FindUserSuccess':
                        oEvntFuncPlaceholder.onSearchByUserSuccess      = fFunction;
                        break;
                    case 'FindUserFails':
                        oEvntFuncPlaceholder.onSearchByUserFails        = fFunction;
                        break;
                }
            }//     /end of Public method on
        };//    /end of the return of Private method SingletonConstructor
    };//        /end of Private method SingletonConstructor
    return {
        /**
         * Public method getInstance
         *
         * Get the Singleton instance if one exists or create one if it doesn't
         *
         * @returns oSingletonInstance
         */
        getInstance: function () {
            if ( !oSingletonInstance ) {
                oSingletonInstance = SingletonConstructor();
            }
            return oSingletonInstance;
        }//     /Public method getInstance
    };//        /return of UserFinder class

})();//         /end of UserFinder class

/**
 * Repo class
 *
 * Defines an individual Repository
 *
 */
joserprieto.RepositoriesCollector.Repo  = function()  {

    var id, name, description, html_url, clone_url, default_branch  = null;
    var bInitialized    = false;

    this.initialize = function(id, name, description, html_url, clone_url, default_branch)
    {
        this.id             = id;
        this.name           = name;
        this.description    = description;
        this.html_url       = html_url;
        this.clone_url      = clone_url;
        this.default_branch = default_branch;
        this.bInitialized   = true;
    };
    this.reset  = function()
    {
        this.id             = null;
        this.name           = null;
        this.description    = null;
        this.html_url       = null;
        this.clone_url      = null;
        this.default_branch = null;
        this.bInitialized   = false;
    };
    this.getID              = function()
    {
        return this.id;
    };
    this.getName            = function()
    {
        return this.name;
    };
    this.getDescription     = function()
    {
        this.description;
    };
    this.getHTML_URL        = function()
    {
        return this.html_url;
    };
    this.getCloneURL        = function()
    {
        return this.clone_url;
    };
    this.getDefaultBranch   = function()
    {
        return this.default_branch;
    };
    this.getInitialized     = function()
    {
        return this.bInitialized;
    };
};

/**
 * Repositories class
 *
 * Search for repositories of an user, stores the information of repositorios of an user / organization,
 * and has the methods to handle these information
 *
 */
joserprieto.RepositoriesCollector.Repositories = (function(){
    /**
     * Private var oSingletonInstance
     *
     * stores a reference to the Singleton:
     */
    var oSingletonInstance;
    /**
     * Private method SingletonConstructor
     *
     * @returns {{getUserID: Function, searchByUserName: Function, getUserName: Function, getOrganizationID: Function, getOrganizationName: Function, getCurrentPage: Function, getCurrentRequestURL: Function}}
     * @constructor
     */
    function SingletonConstructor() {
        /**
         * Private variables:
         */
        var sAPIBaseUrl                 = 'https://api.github.com';
        var sAPIrequestUser             = '/users/:username';
        var sAPIrequestOrganization     = '/orgs/:org';
        var sAPIrequestReposByUsername  = '/users/:username/repos';
        var sAPIrequestReposByUserID    = '/user/:userid/repos';
        var sAPIrequestReposByOrgname   = '/orgs/:org/repos';
        var sAPIrequestReposByOrgID     = '/org/:orgid/repos';
        var iUserID                     = null;
        var sUserName                   = null;
        var iCurrentPage                = null;
        var sCurrentRequestUrl          = null;
        var sUrlReposOfUser             = null;
        var sUrlCurrentPageReposOfUser  = null;
        var sUrlNextPageReposOfUser     = null;
        var sResponseHeaderLink         = null;
        var iNextPage                   = null;
        var sResponseHeaderLink         = null;
        var bNextPage                   = null;
        var iNumReposFetched            = null;
        var aReposOfAuthor              = [];
        var oEvntFuncPlaceholder        =
            {
                onFetchEnd                  : null,
                onFetchStart                : null,
                onFetchFail                 : null,
                onBeforeStartFetchNextPage  : null,
                onFetchNextPage             : null,
                onSaveOneRepo               : null
            };
        var oAuthor  =
            {
                id                          :   null,
                login                       :   null,
                url                         :   null,
                html_url                    :   null,
                type                        :   null,
                name                        :   null,
                company                     :   null,
                blog                        :   null,
                bio                         :   null,
                public_repos                :   null
            };
        var oError  =
            {
                error                       : false,
                description                 : null,
                jqXHR_textStatus            : null,
                jqXHR_errorThrown           : null,
                jqXHR_url                   : null
            };
        /**
         * Private methods:
         */
        /**
         * Private method _resetAuthor
         *
         * @private
         */
        var _resetAuthor     =  function()
        {
            oAuthor.id              = null;
            oAuthor.login           = null;
            oAuthor.url             = null;
            oAuthor.html_url        = null;
            oAuthor.type            = null;
            oAuthor.name            = null;
            oAuthor.company         = null;
            oAuthor.blog            = null;
            oAuthor.bio             = null;
            oAuthor.public_repos    = null;
        };//    /end of Private method _resetAuthor
        /**
         * Private method _resetRepos
         * @private
         */
        var _resetRepos      =  function()
        {
            aReposOfAuthor  = [];
        };//    /end of Private method _resetRepos

        /**
         * Private method _resetError
         *
         * @private
         */
        var _resetError      =  function()
        {
            oError.error                = false;
            oError.description          = null;
            oError.jqXHR_textStatus     = null;
            oError.jqXHR_errorThrown    = null;
            oError.jqXHR_url            = null;
        };//    /end of Private method _resetError

        /**
         * Private method _onFetchNextPage
         *
         * @param xhr
         * @param iCurrentPage
         * @param iNextPage
         * @private
         */
        var _onFetchNextPage  =   function(xhr, iCurrentPage, iNextPage) {
            if (oEvntFuncPlaceholder.onFetchNextPage) {
                oEvntFuncPlaceholder.onFetchNextPage.call(this, xhr, iCurrentPage, iNextPage);
            }
        };//    /end of Private method Private method _onFetchNextPage
        /**
         * Private method _onOneRepoSave
         * @param oRepo
         * @private
         */
        var _onSaveOneRepo              =   function(oRepo, iNumReposFetched)    {
            if (oEvntFuncPlaceholder.onSaveOneRepo) {
                oEvntFuncPlaceholder.onSaveOneRepo.call(this, oRepo, iNumReposFetched);
            }
        };//    /end of Private method _onOneRepoSave
        /**
         * Private method _onFetchFail
         *
         * @param args
         * @private
         */
        var _onFetchFail                =   function(args)    {
            if (oEvntFuncPlaceholder.onFetchFail)   {
                oEvntFuncPlaceholder.onFetchFail.call(this, args);
            }
        };//    /end of Private method _onFetchFail
        /**
         * Private method _onEndOfFetch
         *
         * @param iCurrenttPage
         * @param sCurrentRequestUrl
         * @private
         */
        var _onEndOfFetch               =   function(iCurrenttPage, sCurrentRequestUrl)  {
            if (oEvntFuncPlaceholder.onEndOfFetch)  {
                //eval(fOnEndOfFetchFunction);
                oEvntFuncPlaceholder.onEndOfFetch.call(this, iCurrenttPage, sCurrentRequestUrl);
            }
        };//    /end of Private method _onEndOfFetch

        /**
         * Private method _addRepo
         *
         * @param oRepo
         * @returns {boolean}
         * @private
         */
        var _addRepo                    =   function(oRepo)   {
            aReposOfAuthor.push(oRepo);
            return true;
        };//  /end of Private method _addRepo
        /**
         * Private method _saveFetchedRepos
         *
         * @param oResponseData
         * @private
         */
        var _saveFetchedRepos           =   function(oResponseData)   {
            $.each(oResponseData, function(iRepoIndex) {
                var oRepo = oResponseData[iRepoIndex];
                var oTmpRepo = new joserprieto.RepositoriesCollector.Repo();
                oTmpRepo.initialize(
                    oRepo.id,
                    oRepo.name,
                    oRepo.description,
                    oRepo.html_url,
                    oRepo.clone_url,
                    oRepo.default_branch
                );
                _addRepo(oTmpRepo);
                iNumReposFetched++;
                _onSaveOneRepo(oRepo, iNumReposFetched);
            });
        };//  /end of Private method _saveFetchedRepos
        /**
         * Private method _fetchPageReposByAuthorJqXHRBeforeSend
         *
         * @param xhr
         * @private
         */
        var _fetchPageReposByAuthorJqXHRBeforeSend  =   function(xhr) {
            _onFetchNextPage(xhr, iCurrentPage, iNextPage);
        };//    /end of Private method _fetchPageReposByAuthorJqXHRBeforeSend
        /**
         * Private method _fetchPageReposByAuthorDone
         * @param data
         * @param textStatus
         * @param jqXHR
         * @private
         */
        var _fetchPageReposByAuthorJqXHRDone =   function(data, textStatus, jqXHR) {
            //console.log('fetchPageReposByAuthorDone');
            _saveFetchedRepos(data);
            iCurrentPage++;
            _fetchReposByAuthor();
        };//  /end of Private method _fetchPageReposByAuthorDone
        /**
         * Private method _fetchPageReposByAuthorFail
         *
         * @param jqXHR
         * @param textStatus
         * @param errorThrown
         * @private
         */
        var _fetchPageReposByAuthorJqXHRFail =   function(jqXHR, textStatus, errorThrown) {
            //console.log('fetchPageReposByAuthorFail');
            console.log('se produjo un error en la carga de repositorios');
            console.log(sCurrentRequestUrl);
            var sText           = '¡Error en la carga! URL que se ha intentado cargar:';
            sText               += sCurrentRequestUrl;
            sText               += ' El error es: ' + textStatus + '; ' + errorThrown;
            oError.error                = true;
            oError.description          = sText;
            oError.jqXHR_url            = sCurrentRequestUrl;
            oError.jqXHR_textStatus     = textStatus;
            oError.jqXHR_errorThrown    = errorThrown;
            iCurrentPage    = null;
            _onFetchFail([jqXHR, textStatus, errorThrown]);
        };//  /end of Private method _fetchPageReposByAuthorFail
        /**
         * Private method _fetchPageReposByAuthor
         *
         * @param sUrlToGet
         * @private
         */
        var _fetchPageReposByAuthor     =   function(sUrlToGet)
        {
            //console.log('fetchPageReposByAuthor');
            //console.log(sUrlToGet);
            if (iCurrentPage == 0)  iNextPage = 1;
            else                    iNextPage++;
            jqXHR =
                $.ajax({
                    method:     "GET",
                    url:        sUrlToGet,
                    dataType:   'json',
                    //data: { name: "John", location: "Boston" }
                    beforeSend: _fetchPageReposByAuthorJqXHRBeforeSend
                })
                    .done(_fetchPageReposByAuthorJqXHRDone)
                    .fail(_fetchPageReposByAuthorJqXHRFail);
        };//  /end of Private method _fetchPageReposByAuthor
        /**
         * Private method _fetchReposByAuthor
         *
         * @private
         */
        var _fetchReposByAuthor         =   function()
        {
            //console.log('fetchReposByAuthor');
            if (oAuthor.id) {
                //console.log('fetchReposByAuthor; they be oAuthor setted');
                var _sUrlSearchRepos    = sAPIBaseUrl + sAPIrequestReposByUserID;
                var _iNextPage          = 0;
                _sUrlSearchRepos        = _sUrlSearchRepos.replace(':userid', oAuthor.id);
                sCurrentRequestUrl      = _sUrlSearchRepos;
                if (iCurrentPage == 0)  {
                    // Actual page: 0 (nothing fetched yet)
                    //console.log('fetchReposByAuthor; current page = 0');
                    _fetchPageReposByAuthor(sCurrentRequestUrl);
                }   else    {
                    // Actual page: not 0 (something fetched yet)
                    //console.log('fetchReposByAuthor; current page = ' + iCurrentPage);
                    _iNextPage                  = iCurrentPage + 1;
                    sUrlCurrentPageReposOfUser  = _sUrlSearchRepos + '?page=' + iCurrentPage;
                    sUrlNextPageReposOfUser     = _sUrlSearchRepos + '?page=' + _iNextPage;
                    sResponseHeaderLink         = jqXHR.getResponseHeader('Link');
                    //Link: <https://api.github.com/user/7600578/repos?page=2>; rel="next", <https://api.github.com/user/7600578/repos?page=5>; rel="last"
                    bNextPage                   = (sResponseHeaderLink.indexOf(sUrlNextPageReposOfUser) > 0) ? true : false;
                    if  (bNextPage) {
                        sCurrentRequestUrl      = sUrlNextPageReposOfUser;
                        //console.log('Cargamos siguiente página, página nº: ' + iNextPage);
                        _fetchPageReposByAuthor(sUrlNextPageReposOfUser);
                    }   else    {
                        _onEndOfFetch(iCurrentPage, sCurrentRequestUrl);
                        /*
                        console.log('Cargadas todas las págians; la última página es la página nº: ' + iCurrentPage);
                        iCurrentPage = 0;
                        sText   = 'Datos del usuario/organización del que se han recopilado repositorios:';
                        console.log(sText);
                        */

                    }
                }
            }      else    {
                _onFetchFail(['not author id yet']);
            }
        };//  /end of Private method _fetchReposByAuthor
        /**
         * Private method _findRepoByID
         *
         * @param iRepoID
         * @private
         */
        var _findRepoByID   =   function(iRepoID)   {

        };//    /end of Private method _findRepoByID

        return {
            /**
             * Public method resetAll
             */
            resetAll: function()    {
                iNumReposFetched    = null;
                _resetAuthor();
                _resetRepos();
                _resetError();
            },//  /end of public method resetAll
            /**
             * Public method getAuthor
             *
             * @returns {{id: null, login: null, url: null, html_url: null, type: null, name: null, company: null, blog: null, bio: null, public_repos: null}}
             */
            getAuthor: function()   {
                return oAuthor;
            },//  /end of public method fetchRepos
            /**
             * Public method fetchRepos
             */
            fetchRepos: function()  {
                iNumReposFetched    = 0;
                iCurrentPage        = 0;
                _fetchReposByAuthor();

            },//  /end ofPublic method fetchRepos
            /**
             * Public method setAuthor
             *
             * @param id
             * @param login
             * @param url
             * @param html_url
             * @param type
             * @param name
             * @param company
             * @param blog
             * @param bio
             * @param public_repos
             */
            setAuthor: function(id, login, url, html_url, type, name, company, blog, bio, public_repos)   {
                oAuthor.id              = id;
                oAuthor.login           = login;
                oAuthor.url             = url;
                oAuthor.html_url        = html_url;
                oAuthor.type            = type;
                oAuthor.name            = name;
                oAuthor.company         = company;
                oAuthor.blog            = blog;
                oAuthor.bio             = bio;
                oAuthor.public_repos    = public_repos;
            },//  /end of Public method setAuthor
            /**
             * Public method getAllRepos
             *
             * @returns {Array}
             */
            getAllRepos: function()   {
                return aReposOfAuthor;
            },//  /end of Public method getAllRepos
            /**
             * Public method getNumReposFetched
             *
             * @returns {integer} iNumReposFetched
             */
            getNumReposFetched: function()  {
                return iNumReposFetched;
            },//    /end of Public method getNumReposFetched
            /**
             * Public method addRepo
             * @param oRepo
             * @returns {boolean}
             */
            addRepo: function(oRepo)   {
                _addRepo(oRepo);
            },//  /end of public method addRepo
            /**
             * Method getIndividualRepoByRepoID
             * public
             * @param   iRepoID     integer Github ID of the Repo that has to be find
             * @returns {Object}    Repo found by its ID
             */
            getIndividualRepoByRepoID: function(iRepoID)   {
                var iIndexRepoFound = null;
                iIndexRepoFound     = _findRepoByID(iRepoID);
                if (iIndexRepoFound >= 0)   {

                }   else    {
                    return null;
                }

            },//  /end of public method getRepoByRepoID
            /**
             * Public method on
             *
             * @param sEventName
             * @param fFunction
             */
            on: function(sEventName, fFunction) {
                switch (sEventName) {
                    case 'endOfFetch':
                        oEvntFuncPlaceholder.onEndOfFetch = fFunction;
                        break;
                    case 'failOfFetch':
                        oEvntFuncPlaceholder.onFailOfFetch = fFunction;
                        break;
                    case 'fetchNextPage':
                        oEvntFuncPlaceholder.onFetchNextPage = fFunction;
                        break;
                    case 'saveOneRepo':
                        oEvntFuncPlaceholder.onSaveOneRepo = fFunction;
                        break;
                    default:
                        oEvntFuncPlaceholder.onEndOfFetch = fFunction;
                        break;
                }
            }//     /end of Public method on

        };//  /end the return of Private method SingletonConstructor
    };//      /end of Private method SingletonConstructor
    return {
        /**
         * Public method getInstance
         *
         * Get the Singleton instance if one exists or create one if it doesn't
         *
         * @returns oSingletonInstance
         */
        getInstance: function () {
            if ( !oSingletonInstance ) {
                oSingletonInstance = SingletonConstructor();
            }
            return oSingletonInstance;
         }// /end of Public method getInstance
    };//        /end of return of Class Repositories
})();//         /end of Class Repositories

/**
 * Render class
 *
 * Class for render and present the repositories in HTML and other.
 *
 */
joserprieto.RepositoriesCollector.Render = (function(){
    /**
     * Private var oSingletonInstance
     *
     * stores a reference to the Singleton:
     */
    var oSingletonInstance;
    /**
     * Private method SingletonConstructor
     *
     * @returns {{getUserID: Function, searchByUserName: Function, getUserName: Function, getOrganizationID: Function, getOrganizationName: Function, getCurrentPage: Function, getCurrentRequestURL: Function}}
     * @constructor
     */
    function SingletonConstructor() {
        // Private methods and variables:
        /**
         * Private variables:
         */
        var jqDivNotify         = null;
        var jqDivNotiSuccess    = null;
        var jqDivResponse       = null;
        var jqDivInputCont      = null;
        var jqTBodyResponse     = null;
        var jqButton		    = null;
        var jqInput             = null;
        var sTplRepoRow         = null;
        // Init the vars:
        jqDivNotify             = $('#div_notify');
        jqDivNotiSuccess        = $('#div_notify_response_success');
        jqDivResponse           = $('#div_response');
        jqDivInputCont          = $('#div_input_user_or_organization');
        jqTBodyResponse         = $('#table_tbody_response');
        jqInput                 = $('#input_user_or_organization');
        jqButton                = $('#btn_load_repos');
        sTplRepoRow             = '<tr id="{{id}}"><th scope="row">{{id}}</th>' +
                                    '<td>{{id}}</td><td>{{name}}</td><td>{{description}}</td>' +
                                    '<td>{{html_url}}</td><td>{{clone_url}}</td>' +
                                    '<td>{{default_branch}}</td></tr>';

        /**
         * Private methods:
         */
        /**
         * Private method _renderRepos
         *
         * @param aRepositories
         * @private
         */
        var _renderRepos    =   function(aRepositories) {
            //console.log(aRepositories);
            $.each(aRepositories, function(iIndex)  {
                var sHTML   = '';
                var oRepo   = aRepositories[iIndex];
                //console.log(oRepo);
                //console.log(sTplRepoRow);
                sHTML       = sTplRepoRow.replace(/{{id}}/g, oRepo.id);
                sHTML       = sHTML.replace(/{{name}}/g, oRepo.name);
                sHTML       = sHTML.replace(/{{description}}/g, oRepo.description);
                sHTML       = sHTML.replace(/{{html_url}}/g, oRepo.html_url);
                sHTML       = sHTML.replace(/{{clone_url}}/g, oRepo.clone_url);
                sHTML       = sHTML.replace(/{{default_branch}}/g, oRepo.default_branch);
                jqTBodyResponse.append(sHTML);
            });
        };//    /end of Private method _renderRepos
        /**
         * Private method _getNotifyHTML
         *
         * @returns {*}
         * @private
         */
        var _getNotifyHTML  =   function()  {
            return jqDivNotify.html();
        };//    /end of Private method _getNotifyHTML
        /**
         * Private method setNotifyHTML
         *
         * @param sHTML
         * @private
         */
        var _setNotifyHTML  =   function(sHTML)  {
            jqDivNotify.html(sHTML);
        };//    /end of Private method setNotifyHTML

        return {
            // Public methods and variables
            /**
             * Public method clearRepositories
             *
             */
            clearRepositories   :   function ()     {
                jqTBodyResponse.empty();
            },//     /end of Public method clearRepositories
            /**
             * Public method clearNotifies
             *
             */
            clearNotifies       :   function()      {
                jqDivNotify.empty();
            },//    /end of Public method clearNotifies
            /**
             * Public method addNotifyMsg
             * @param sMsg
             */
            addNotifyMsg        :   function(sMsg)  {
                var sTmpMsg = _getNotifyHTML();
                sTmpMsg += sMsg;
                _setNotifyHTML(sTmpMsg);

            },//    /end of Public method addNotifyMsg
            getNotifyMsg        :   function()      {
                return _getNotifyHTML();
            },//    /
            setNotifyMsg        :   function(sMsg)  {
                _setNotifyHTML(sMsg);
            },//    /
            /**
             * Public method renderRepositories
             *
             * @param aRepos
             */
            renderRepositories  :   function (aRepos) {
                _renderRepos(aRepos);
            }//     /end of Public method renderRepositories
        };//        /end of the return of Private method SingletonConstructor
    };//            /end of Private method SingletonConstructor
    return {
        /**
         * Public method getInstance
         *
         * Get the Singleton instance if one exists or create one if it doesn't
         *
         * @returns oSingletonInstance
         */
        getInstance: function () {
            if ( !oSingletonInstance ) {
                oSingletonInstance = SingletonConstructor();
            }
            return oSingletonInstance;
        }//     /Public method getInstance
    };//        /return of Render class

})();//         /end of Render class





/**
 * Shortcuts definitions:
 */
jrpUserFinder   = joserprieto.RepositoriesCollector.UserFinder;
jrpRepositories = joserprieto.RepositoriesCollector.Repositories;
jrpRepo         = joserprieto.RepositoriesCollector.Repo;
jrpRender       = joserprieto.RepositoriesCollector.Render;


var oDivNotify	    = null;
var oDivNotiSuccess = null;
var oDivResponse    = null;
var oDivInputCont   = null;
var oTBodyResponse  = null;
var oButton		    = null;
var oInput          = null;
var jqXHR		    = null;
var iIdUser         = null;
var iIdOrganization = null;
var iCurrentPage    = null;
var sUser           = null;
var sUrl            = null;

//var sTplRepoRow     = '<tr id="{{id}}"><th scope="row">{{id}}</th><td>{{name}}</td><td>{{fullname}}</td><td>{{description}}</td><td>{{repourl}}</td><td>{{gitcloneurl}}</td><td>{{defaultbranch}}</td></tr>';



$(document).ready(function() {
    // Handler for .ready() called.


    oDivNotify	    = $('#div_notify');
    oDivNotiSuccess = $('#div_notify_response_success');
    oDivResponse    = $('#div_response');
    oDivInputCont   = $('#div_input_user_or_organization');
    oInput          = $('#input_user_or_organization');
    oButton		    = $('#btn_load_repos');
    oTBodyResponse  = $('#table_tbody_response');
    oDivNotify.html("<p>Pulse el bot&oacute;n para cargar repositorios</p>");

    var fSearchOfUser =
        function()  {
            sUser               = oInput.val();
            if (sUser == null || sUser == '')  {
                var sText = '<p><b>¡¡INTRODUZCA UN NOMBRE DE USUARIO PARA BUSCAR SUS REPOSITORIOS!!</b></p>';
                oDivNotify.html(sText);
                oDivInputCont.addClass('has-error');
                oInput.focus();
            }   else    {
                oDivInputCont.removeClass('has-error');
                // Se muestra que se va a buscar por este usuario
                jrpUserFinder.getInstance().
                                on('UserSearchStart', function(data, textStatus, jqXHR) {
                    var sText = '<p>Se va a buscar por el usuario: <b>' + sUser + '</b></p>';
                    jrpRender.getInstance().addNotifyMsg(sText);
                });
                // Si se encuentra el usuario:
                jrpUserFinder.getInstance().
                                on('FindUserSuccess', function(data, textStatus, jqXHR) {
                    var sText = '<p>Se ha encontrado al usuario: <b>' + sUser + '</b></p>';
                    jrpRender.getInstance().addNotifyMsg(sText);
                    jrpRepositories.getInstance().
                        setAuthor(data.id, data.logn, data.url, data.html_url, data.type, data.name, data.company, data.blog, data.bio, data.public_repos);
                    fFetchReposOfUser();
                });
                // Si hay algún error en la búsqueda:
                jrpUserFinder.getInstance().
                                on('FindUserFails', function(jqXHR, textStatus, errorThrow) {
                    var sText = '<p>Ha habido un error en la búsqueda del usuario: <b>' + sUser + '</b></p>';
                    jrpRender.getInstance().addNotifyMsg(sText);
                });
                // Se han definido todos los behaviours; se lanza la búsqueda:
                jrpUserFinder.getInstance().
                                searchByUserName(sUser);
            }
        };  //  /fSearchOfUser

    var fFetchReposOfUser   =
        function()
        {
            var sText = null;
            jrpRepositories.getInstance().on('endOfFetch', function(iCurrentPage, sCurrentRequestUrl) {
                sText = '<p>Se ha terminado de buscar, en el número de paginación: ' + iCurrentPage + '</p>';
                jrpRender.getInstance().addNotifyMsg(sText);
                jrpRender.getInstance().renderRepositories(
                    jrpRepositories.getInstance().getAllRepos()
                );
            });
            jrpRepositories.getInstance().on('failOfFetch', function() {
                sText = '<p>Se ha producido un error en la búsqueda, no es posible continuar.</p>';
                jrpRender.getInstance().addNotifyMsg(sText);
            });
            jrpRepositories.getInstance().on('fetchNextPage', function(xhr, iCurrentPage, iNextPage) {
                sText = '<p>Se ha cargado el número de paginación de repositorios: ' + iCurrentPage +
                        '; a continuacion, se solicita el número de paginación de repositorios: ' + iNextPage + '</p>';
                jrpRender.getInstance().addNotifyMsg(sText);
            });
            jrpRepositories.getInstance().on('saveOneRepo', function(oRepo, iNumReposFetched) {
                sText = '<p>Se ha guardado el repositorio con ID de GitHub: ' + oRepo.id +
                    '; ya se han guardado un total de : ' + iNumReposFetched + ' repositorios</p>';
                jrpRender.getInstance().addNotifyMsg(sText);
            });
            // Todos los behavious definidos, se traen los repos:
            jrpRepositories.getInstance().fetchRepos();
        };

    oButton.on('click', function() {
        // Se borra, si hubiese algo, en el div de notificación de respuesta:
        oDivNotiSuccess.empty();
        // Se borra, si hubiese algo, la tabla de resultados:
        oTBodyResponse.empty();
        // se lanza la petición del usuario:
        fSearchOfUser();
    }); //  /oButton.on('click',function()

});





/*                jqXHR =
 $.ajax(
 {
 method:     "GET",
 url:        sUrlSearchUser,
 dataType:   'json',
 })
 .done(function(data, textStatus, jqXHR)
 {
 iIdUser         = data.id;
 iIdOrganization = null;
 iCurrentPage    = 0;
 console.log(jqXHR.getAllResponseHeaders());
 var sText = 'Se ha encontrado el usuario: ' +
 sUser +
 ', y su ID en github es: ' +
 data.id;
 oDivNotify.html(sText);
 oGetterRepos.author.id              = data.id;
 oGetterRepos.author.url             = data.url;
 oGetterRepos.author.html_url        = data.html_url;
 oGetterRepos.author.type            = data.type;
 oGetterRepos.author.name            = data.name;
 oGetterRepos.author.company         = data.company;
 oGetterRepos.author.blog            = data.blog;
 oGetterRepos.author.bio             = data.bio;
 oGetterRepos.author.public_repos    = data.public_repos;
 oGetterRepos.num_repos_fetched      = 0;
 fGetsReposOfUser();
 })
 .fail(function(jqXHR, textStatus, errorThrown)
 {
 var sText   = '<p>¡Error en la carga!</p>';
 sText       += '<p>URL que se ha intentado cargar:</p>';
 sText       += '<p>' + sUrlSearchUser + '</p>';
 sText       += '<p>El error es: ' + textStatus;
 sText       += '; ' + errorThrown + '</p>';
 sText       += '<p>No se encuentra el usuario; se probará a buscar como organización</p>';
 iIdUser         = null;
 iCurrentPage    = null;
 oDivNotify.html(sText);
 });*/