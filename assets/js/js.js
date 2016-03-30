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
        var sAPIBaseUrl,
            sAPIrequestUser,
            sAPIrequestOrganization,
            sAPIrequestReposByUsername,
            sAPIrequestReposByUserID,
            sAPIrequestReposByOrgname,
            sAPIrequestReposByOrgID,
            iUserID,
            sUserName,
            iOrganizationID,
            sOrganizationName,
            iCurrentPage,
            sCurrentRequestUrl,
            jqXHR,
            oEvntFuncPlaceholder;

        // Initialize some variables:
        sAPIBaseUrl                 = 'https://api.github.com';
        sAPIrequestUser             = '/users/:username';
        sAPIrequestOrganization     = '/orgs/:org';
        sAPIrequestReposByUsername  = '/users/:username/repos';
        sAPIrequestReposByUserID    = '/user/:userid/repos';
        sAPIrequestReposByOrgname   = '/orgs/:org/repos';
        sAPIrequestReposByOrgID     = '/org/:orgid/repos';
        oEvntFuncPlaceholder        =
        {
            onSearchByUserBeforeStart   :   null,
            onSearchByUserSuccess       :   null,
            onSearchByUserFails         :   null
        };
        /**
         * Private methods:
         */

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
                    case 'userSearchStart':
                        oEvntFuncPlaceholder.onSearchByUserBeforeStart  = fFunction;
                        break;
                    case 'findUserSuccess':
                        oEvntFuncPlaceholder.onSearchByUserSuccess      = fFunction;
                        break;
                    case 'findUserFails':
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

    var id,
        name,
        description,
        html_url,
        clone_url,
        default_branch,
        bInitialized;

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
        var sAPIBaseUrl,
            sAPIrequestUser,
            sAPIrequestOrganization,
            sAPIrequestReposByUsername,
            sAPIrequestReposByUserID,
            sAPIrequestReposByOrgname,
            sAPIrequestReposByOrgID,
            iUserID,
            sUserName,
            iCurrentPage,
            sCurrentRequestUrl,
            sUrlReposOfUser,
            sUrlCurrentPageReposOfUser,
            sUrlNextPageReposOfUser,
            sResponseHeaderLink,
            bNextPage,
            iNumReposFetched,
            aReposOfAuthor,
            oEvntFuncPlaceholder,
            oAuthor,
            oError;

        // Init some variables:
        sAPIBaseUrl                 = 'https://api.github.com';
        sAPIrequestUser             = '/users/:username';
        sAPIrequestOrganization     = '/orgs/:org';
        sAPIrequestReposByUsername  = '/users/:username/repos';
        sAPIrequestReposByUserID    = '/user/:userid/repos';
        sAPIrequestReposByOrgname   = '/orgs/:org/repos';
        sAPIrequestReposByOrgID     = '/org/:orgid/repos';
        aReposOfAuthor              = [];
        oEvntFuncPlaceholder        =
            {
                onFetchEnd                  : null,
                onFetchStart                : null,
                onFetchFail                 : null,
                onBeforeStartFetchNextPage  : null,
                onFetchNextPage             : null,
                onSaveOneRepo               : null
            };
        oAuthor  =
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
        oError  =
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
                    bNextPage                   = (sResponseHeaderLink.indexOf(sUrlNextPageReposOfUser) > 0);
                    if  (bNextPage) {
                        sCurrentRequestUrl      = sUrlNextPageReposOfUser;
                        //console.log('Cargamos siguiente página, página nº: ' + iNextPage);
                        _fetchPageReposByAuthor(sUrlNextPageReposOfUser);
                    }   else    {
                        _onEndOfFetch(iCurrentPage, sCurrentRequestUrl);
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
            // TODO
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



joserprieto.RepositoriesCollector.ScriptsConstructor = (function(){
    /**
     * Private var oSingletonInstance
     *
     * stores a reference to the Singleton:
     */
    var oSingletonInstance;
    /**
     * Private method SingletonConstructor
     *
     * @constructor
     */
    function SingletonConstructor() {
        /**
         * Private vars
         */
        var oRepos,
            sBashScript,
            sAddonsPath,
            sPathOdoo,
            sPathAddons =   null;


        /**
         * Private methods
         */



        return  {
            /**
             * Public vars
             */


            /**
             * Public methods
             */


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
    };//    /end of return of Class ScriptsConstructor
})();//     /end of Class ScriptsConstructor

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
        var jqDivPnlRepoSuccess,
            jqDivPnlBodyRepoSuccess,
            jqDivPnlNotify,
            jqDivPnlBodyNotify,
            jqDivPnlLog,
            jqDivPnlBodyLog,
            jqDivResponse,
            jqTBodyResponse,
            jqDivInputCont,
            jqButton,
            jqInput,
            sTplRepoRow;
        // Init some vars:
        jqDivPnlRepoSuccess         = $('#div_pnl_success');
        jqDivPnlBodyRepoSuccess     = $('#div_pnl_body_success');
        jqDivPnlNotify              = $('#div_pnl_notify');
        jqDivPnlBodyNotify          = $('#div_pnl_body_notify');
        jqDivPnlLog                 = $('#div_pnl_log');
        jqDivPnlBodyLog             = $('#div_pnl_body_log');
        jqDivResponse               = $('#div_response');
        jqDivInputCont              = $('#div_input_user_or_organization');
        jqTBodyResponse             = $('#table_tbody_response');
        jqInput                     = $('#input_user_or_organization');
        jqButton                    = $('#btn_load_repos');
        sTplRepoRow                 = '<tr id="_id_"><th scope="row">_id_</th>' +
                                        '<td>_id_</td><td>_name_</td><td>_description_</td>' +
                                        '<td>_html_url_</td><td>_clone_url_</td>' +
                                        '<td>_default_branch_</td></tr>';
        // Init action for use jQuery methods:
        jqDivPnlRepoSuccess.removeClass('hidden');
        jqDivPnlRepoSuccess.hide();

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
                sHTML       = sTplRepoRow.replace(/_id_/g, oRepo.id);
                sHTML       = sHTML.replace(/_name_/g, oRepo.name);
                sHTML       = sHTML.replace(/_description_/g, oRepo.description);
                sHTML       = sHTML.replace(/_html_url_/g, oRepo.html_url);
                sHTML       = sHTML.replace(/_clone_url_/g, oRepo.clone_url);
                sHTML       = sHTML.replace(/_default_branch_/g, oRepo.default_branch);
                jqTBodyResponse.append(sHTML);
            });
        };//    /end of Private method _renderRepos

        /**
         * Private method _getPanelBodyHTML
         *
         * @param jqPanel
         * @returns {*}
         * @private
         */
        var _getPanelBodyHTML   =   function(jqPanel)   {
            if (jqPanel)
                return jqPanel.html();
            else
                return false;
        };//    /End of Private method _getPanelBodyHTML
        /**
         * Private method _setPanelBodyHTML
         *
         * @param jqPanel
         * @param sHTML
         * @returns {*}
         * @private
         */
        var _setPanelBodyHTML   =   function(jqPanel, sHTML)   {
            if (jqPanel)    {
                if  (sHTML) {
                    jqPanel.html(sHTML);
                }
                return jqPanel;
            }   else    {
                return false;
            }
        };//    /End of Private method _setPanelBodyHTML
        /**
         * Private method _addHTMLtoPanelBody
         *
         * @param jqPanel
         * @param sHTML
         * @returns {*}
         * @private
         */
        var _addHTMLtoPanelBody   =   function(jqPanel, sHTML)   {
            if (jqPanel)    {
                if  (sHTML) {
                    var sPreviousHTML   = _getPanelBodyHTML(jqPanel);
                    var sEndHTML        = sPreviousHTML + sHTML;
                    jqPanel.html(sEndHTML);
                }
                return jqPanel;
            }   else    {
                return false;
            }
        };//    /End of Private method _addHTMLtoPanelBody
        /**
         * Private method _clearPanelBodyHTML
         * @param jqPanel
         * @returns {*}
         * @private
         */
        var _clearPanelBodyHTML =   function(jqPanel)   {
            if (jqPanel)    {
                jqPanel.empty();
                return jqPanel;
            }
            return false
        };//    /End of Private method _clearPanelBodyHTML
        /**
         * Private method _collapsePanel
         * @param jqPanel
         * @param sMode
         * @private
         */
        var _collapsePanel  =       function(jqPanel, sMode)    {
            if (jqPanel)    {
                switch (sMode)  {
                    case 'show':
                        jqPanel.collapse('show');
                        break;
                    case 'hide':
                        jqPanel.collapse('hide');
                        break;
                }
                return jqPanel;
            }
            return false;
        };//    /end of Private method _collapsePanel
        var _showPanel      =   function(jqPanel, sMode)    {
            if (jqPanel)    {
                switch (sMode)  {
                    case 'show':
                        jqPanel.show();
                        break;
                    case 'hide':
                        jqPanel.hide();
                        break;
                }
                return jqPanel;
            }
            return false;
        };//    /
        var _renderSuccessMsg   = function()    {
            var sHTML           =   '';
            var sTplSuccessMsg  =   '<p>Datos del usuario/organización del que se han recopilado repositorios:</p>' +
                                    '<p>El nombre del usuario es <b>_author_name_</b><br>' +
                                    ' su id de usuario en GitHub es: <b>_author_id_</b>' +
                                    '<br>Su api url es: _author_api_url_<br>' +
                                    'Su url en GitHub es: _author_github_url_<br>' +
                                    'Tipo de usuario: _author_user_type_<br>' +
                                    'Compañía: _author_company_<br>' +
                                    'Url sitio web: _author_web_url_<br>' +
                                    'Bio: _author_bio_' +
                                    '<br>Repositorios públicos: <b>_author_public_repos_</b></p>' +
                                    '<p>Se han recopilado un total de <b>_number_fetched_repos_</b> repositorios </p>';
            var oRepositories   =   joserprieto.RepositoriesCollector.Repositories.getInstance();
            var oAuthor         =   oRepositories.getAuthor();
            sHTML   = sTplSuccessMsg.replace(/_author_name_/g, oAuthor.name);
            sHTML   = sHTML.replace(/_author_id_/g, oAuthor.id);
            sHTML   = sHTML.replace(/_author_api_url_/g, oAuthor.url);
            sHTML   = sHTML.replace(/_author_github_url_/g, oAuthor.html_url);
            sHTML   = sHTML.replace(/_author_user_type_/g, oAuthor.type);
            sHTML   = sHTML.replace(/_author_company_/g, oAuthor.company);
            sHTML   = sHTML.replace(/_author_web_url_/g, oAuthor.blog);
            sHTML   = sHTML.replace(/_author_bio_/g, oAuthor.bio);
            sHTML   = sHTML.replace(/_author_public_repos_/g, oAuthor.public_repos);
            sHTML   = sHTML.replace(/_number_fetched_repos_/g, oRepositories.getNumReposFetched());
            jqDivPnlBodyRepoSuccess.html(sHTML);
        };//    /

        return {
            // Public methods and variables


            /**
             * Public method clearNotifies
             *
             */
            clearNotifies       :   function()      {
                _clearPanelBodyHTML(jqDivPnlBodyNotify);
            },//    /end of Public method clearNotifies
            /**
             * Public method addNotifyMsg
             * @param sMsg
             */
            addNotifyMsg        :   function(sMsg)  {
                _addHTMLtoPanelBody(jqDivPnlBodyNotify, sMsg);
            },//    /end of Public method addNotifyMsg
            /**
             * Public method getNotifyMsg
             *
             * @returns {*}
             */
            getNotifyMsg        :   function()      {
                return _getPanelBodyHTML(jqDivPnlBodyNotify);
            },//    /end of Public method getNotifyMsg
            /**
             * Public method setNotifyMsg
             *
             * @param sMsg
             */
            setNotifyMsg        :   function(sMsg)  {
                _setPanelBodyHTML(jqDivPnlBodyNotify, sMsg);
            },//    /end of Public method setNotifyMsg
            /**
             * Public method collapseNotifies
             *
             * @param sMode
             */
            collapseNotifies    :   function(sMode) {
                _collapsePanel(jqDivPnlBodyNotify, sMode);
            },//    /end of Public method collapseNotifies
            /**
             * Public method clearLogMsg
             *
             */
            clearLogMsg     :   function()      {
                return _clearPanelBodyHTML(jqDivPnlBodyLog);
            },//    /end of Public method clearLogMsg
            /**
             * Public method addLogMsg
             * @param sMsg
             */
            addLogMsg       :   function(sMsg)  {
                return _addHTMLtoPanelBody(jqDivPnlBodyLog, sMsg);
            },//    /end of Public method addLogMsg
            /**
             * Public method getLogMsg
             *
             * @returns {*}
             */
            getLogMsg       :   function()      {
                return _getPanelBodyHTML(jqDivPnlBodyLog);
            },//    /end of Public method getLogMsg
            /**
             * Public method setLogMsg
             *
             * @param sMsg
             */
            setLogMsg       :   function(sMsg)  {
                _setPanelBodyHTML(jqDivPnlBodyLog, sMsg);
            },//    /end of Public method setLogMsg
            /**
             * Public method collapseLog
             *
             * @param sMode
             */
            collapseLog     :   function(sMode) {
                _collapsePanel(jqDivPnlBodyLog, sMode);
            },//    /end of Public method collapseLog

            /**
             * Public method clearSuccessMsg
             *
             */
            clearSuccessMsg :   function()      {
                _clearPanelBodyHTML(jqDivPnlBodyRepoSuccess);
            },//    /end of Public method clearSuccessMsg
            /**
             * Public method addSuccessMsg
             *
             * @param sMsg
             */
            addSuccessMsg   :   function(sMsg)  {
                _addHTMLtoPanelBody(jqDivPnlBodyRepoSuccess, sMsg);
            },//    /end of Public method addSuccessMsg
            /**
             * Public method getSuccessMsg
             *
             * @returns {*}
             */
            getSuccessMsg   :   function()      {
                return _getPanelBodyHTML(jqDivPnlBodyRepoSuccess);
            },//    /end of Public method getSuccessMsg
            /**
             * Public method setSuccessMsg
             *
             * @param sMsg
             */
            setSuccessMsg   :   function(sMsg)  {
                _setPanelBodyHTML(jqDivPnlBodyRepoSuccess, sMsg);
            },//    /end of Public method setSuccessMsg
            /**
             * Public method collapseSuccessMsgs
             *
             * @param sMode
             */
            collapseSuccessMsgs :   function(sMode) {
                _collapsePanel(jqDivPnlBodyRepoSuccess, sMode);
            },//    /end of Public method collapseSuccessMsgs
            /**
             * Public method showSuccessMsgs
             *
             * @param sMode
             */
            showSuccessMsgs     :   function(sMode) {
                if (sMode = 'show') {
                    _renderSuccessMsg();
                }
                _showPanel(jqDivPnlRepoSuccess, sMode);
            },//    /end of Public method showSuccessMsgs
            /**
             * Public method clearRepositories
             *
             */
            clearRepositories   :   function ()     {
                jqTBodyResponse.empty();
            },//     /end of Public method clearRepositories
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

/**
 * Variables with need to have page scope:
 */
var jqDivInputCont,
    jqButton,
    jqInput,
    sUser;

$(document).ready(function() {
    // Handler for .ready() called.


    // Init some variables:
    jqDivInputCont  = $('#div_input_user_or_organization');
    jqInput         = $('#input_user_or_organization');
    jqButton		= $('#btn_load_repos');

    var fSearchOfUser =
        function()  {
            sUser   = jqInput.val();
            if (sUser == null || sUser == '')  {
                var sText               = '<p><b>¡¡INTRODUZCA UN NOMBRE DE USUARIO PARA BUSCAR SUS REPOSITORIOS!!</b></p>';
                var jrpRenderInstance   =   jrpRender.getInstance();
                jrpRenderInstance.setNotifyMsg(sText);
                jrpRenderInstance.collapseNotifies('show');
                jqDivInputCont.addClass('has-error');
                jqInput.focus();
            }   else    {
                var jrpUserFinderInstance   =   jrpUserFinder.getInstance();
                jqDivInputCont.removeClass('has-error');
                // Se muestra que se va a buscar por este usuario
                jrpUserFinderInstance.on('userSearchStart', function(data, textStatus, jqXHR) {
                    var sText               = '<p>Se va a buscar por el usuario: <b>' + sUser + '</b></p>';
                    var jrpRenderInstance   =   jrpRender.getInstance();
                    jrpRenderInstance.addLogMsg(sText);
                    jrpRenderInstance.setNotifyMsg(sText);
                    jrpRenderInstance.collapseNotifies('show');
                    jrpRenderInstance.collapseLog('show');
                });
                // Si se encuentra el usuario:
                jrpUserFinderInstance.on('findUserSuccess', function(data, textStatus, jqXHR) {
                    var jrpRenderInstance,
                        jrpRepositoriesInstance,
                        sText;
                    jrpRenderInstance       =   jrpRender.getInstance();
                    jrpRepositoriesInstance =   jrpRepositories.getInstance();
                    sText                   = '<p>Se ha encontrado al usuario: <b>' + sUser + '</b></p>';
                    jrpRenderInstance.addLogMsg(sText);
                    jrpRenderInstance.setNotifyMsg(sText);
                    jrpRenderInstance.collapseNotifies('show');
                    jrpRenderInstance.collapseLog('show');
                    jrpRepositoriesInstance.setAuthor(  data.id,
                                                        data.login,
                                                        data.url,
                                                        data.html_url,
                                                        data.type,
                                                        data.name,
                                                        data.company,
                                                        data.blog,
                                                        data.bio,
                                                        data.public_repos);
                    fFetchReposOfUser();
                });
                // Si hay algún error en la búsqueda:
                jrpUserFinderInstance.on('findUserFails', function(jqXHR, textStatus, errorThrow) {
                    var sText               = '<p>Ha habido un error en la búsqueda del usuario: <b>' + sUser + '</b></p>';
                    var jrpRenderInstance   =   jrpRender.getInstance();
                    jrpRenderInstance.addLogMsg(sText);
                    jrpRenderInstance.setNotifyMsg(sText);
                    jrpRenderInstance.collapseNotifies('show');
                    jrpRenderInstance.collapseLog('show');
                });
                // Se han definido todos los behaviours; se lanza la búsqueda:
                jrpUserFinderInstance.searchByUserName(sUser);
            }
        };  //  /fSearchOfUser

    var fFetchReposOfUser   =
        function()
        {
            var sText,
                jrpRepositoriesInstance;
            jrpRepositoriesInstance = jrpRepositories.getInstance();
            jrpRepositoriesInstance.on('endOfFetch', function(iCurrentPage, sCurrentRequestUrl) {
                var oRepos,
                    jrpRenderInstance,
                    sText;
                oRepos              = jrpRepositories.getInstance().getAllRepos();
                jrpRenderInstance   = jrpRender.getInstance();
                sText               = '<p>Se ha terminado de buscar, en el número de paginación: ' +
                                                                                            iCurrentPage + '</p>';
                jrpRenderInstance.addLogMsg(sText);
                jrpRenderInstance.setNotifyMsg(sText);
                jrpRenderInstance.collapseNotifies('hide');
                jrpRenderInstance.collapseLog('hide');
                jrpRenderInstance.showSuccessMsgs('show');
                jrpRenderInstance.renderRepositories(oRepos);
            });
            jrpRepositoriesInstance.on('failOfFetch', function() {
                var sText,
                    jrpRenderInstance;
                jrpRenderInstance   = jrpRender.getInstance();
                sText               = '<p>Se ha producido un error en la búsqueda, no es posible continuar.</p>';
                jrpRenderInstance.addLogMsg(sText);
                jrpRenderInstance.setNotifyMsg(sText);
                jrpRenderInstance.collapseNotifies('show');
                jrpRenderInstance.collapseLog('show');
            });
            jrpRepositoriesInstance.on('fetchNextPage', function(xhr, iCurrentPage, iNextPage) {
                var sText,
                    jrpRenderInstance;
                jrpRenderInstance   = jrpRender.getInstance();
                sText = '<p>Se ha cargado el número de paginación de repositorios: ' +
                            iCurrentPage +
                            '; a continuacion, se solicita el número de paginación de repositorios: ' +
                            iNextPage +
                            '</p>';
                jrpRenderInstance.addLogMsg(sText);
                jrpRenderInstance.collapseLog('show');
            });
            jrpRepositoriesInstance.on('saveOneRepo', function(oRepo, iNumReposFetched) {
                var sText,
                    jrpRenderInstance;
                jrpRenderInstance   =   jrpRender.getInstance();
                sText               =   '<p>Se ha guardado el repositorio con ID de GitHub: ' +
                                            oRepo.id +
                                            '; ya se han guardado un total de : ' +
                                            iNumReposFetched +
                                            ' repositorios</p>';
                jrpRenderInstance.addLogMsg(sText);
                jrpRenderInstance.collapseLog('show');
            });
            // Todos los behaviours definidos, se traen los repos:
            jrpRepositoriesInstance.fetchRepos();
        };

    jqButton.on('click', function() {
        var jrpRenderInstance;
        jrpRenderInstance   =   jrpRender.getInstance();
        // Se borra, si hubiese algo, en las diferentes áreas de notificación, y los repositorios:
        jrpRenderInstance.clearLogMsg();
        jrpRenderInstance.clearNotifies();
        jrpRenderInstance.clearSuccessMsg();
        jrpRenderInstance.clearRepositories();
        jrpRenderInstance.collapseNotifies('hide');
        jrpRenderInstance.collapseLog('hide');
        // se lanza la petición del usuario:
        fSearchOfUser();
    }); //  /jqButton.on('click',function()

});