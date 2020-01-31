import merge from "merge";
import stateData from "./state/data";
import vuex from "./state/vuex";
import normal from "./state/normal";
import Table from "./table";
import resizableColumns from "./helpers/resizeable-columns";
import VtServerTable from "./components/VtServerTable";

var data = require("./mixins/data");
var created = require("./mixins/created");
var provide = require("./mixins/provide")

var themes = {
    bootstrap3: require('./themes/bootstrap3')(),
    bootstrap4: require('./themes/bootstrap4')(),
    bulma: require('./themes/bulma')()
};

exports.install = function (
    Vue,
    globalOptions,
    useVuex,
    theme = "bootstrap3",
    componentsOverride = {}
) {
    let state = useVuex ? vuex("server") : normal();

    var server = merge.recursive(
        true,
        Table(),
        {
            name: "r-l-server-table",
            render: require('./components/renderless/RLDataTable'),
            props: {
                columns: {
                    type: Array,
                    required: true
                },
                url: {
                    type: String
                },
                name: {
                    type: String,
                    required: false
                },
                options: {
                    type: Object,
                    required: false,
                    default: function () {
                        return {};
                    }
                }
            },
            provide,
            created: function () {
                if (!this.opts.requestFunction && !this.url) {
                    throw 'vue-tables-2: you must provide either a "url" prop or a custom request function. Aborting';
                }

                created(this);

                if (!this.vuex) {
                    this.query = this.initQuery();
                    this.initOrderBy();
                    this.customQueries = this.initCustomFilters();
                }

                if (this.opts.sendInitialRequest) {
                    this.loadState();

                    this.getData(true).then(
                        function (response) {
                            if (typeof response === 'undefined') return;

                            this.setData(response);
                            this.loading = false;

                            if (this.hasDateFilters()) {
                                setTimeout(
                                    function () {
                                        this.initDateFilters();
                                    }.bind(this),
                                    0
                                );
                            }
                        }.bind(this)
                    );
                }
            },
            mounted: function () {
                this._setFiltersDOM(this.query);

                if (this.opts.resizableColumns) {
                    resizableColumns(
                        this.$el.querySelector("table"),
                        this.hasChildRow,
                        this.opts.childRowTogglerFirst,
                        this.opts.resizableColumns
                    );
                }

                // this._setColumnsDropdownCloseListener();

                if (this.vuex) return;

                this.registerServerFilters();

                if (this.options.initialPage)
                    this.setPage(this.options.initialPage, true);
            },
            data: function () {
                return merge.recursive(
                    data(),
                    {
                        source: "server",
                        loading: true,
                        lastKeyStrokeAt: false,
                        globalOptions,
                        componentsOverride,
                        theme: typeof theme==='string' ? themes[theme] : theme()
                    },
                    stateData(useVuex, "server", this.options.initialPage)
                );
            },
            methods: {
                refresh: require("./methods/refresh"),
                getData: require("./methods/get-data"),
                setData: require("./methods/set-data"),
                serverSearch: require("./methods/server-search"),
                registerServerFilters: require("./methods/register-server-filters"),
                loadState() {
                    if (!this.opts.saveState) return;

                    if (!this.storage.getItem(this.stateKey)) {
                        this.initState();
                        this.activeState = true;
                        return;
                    }

                    var state = JSON.parse(this.storage.getItem(this.stateKey));

                    if (this.vuex) {
                        this.commit("SET_STATE", {
                            query: state.query,
                            customQueries: state.customQueries,
                            page: state.page,
                            limit: state.perPage,
                            orderBy: state.orderBy
                        });
                    } else {
                        this.page = state.page;
                        this.query = state.query;
                        this.customQueries = state.customQueries;
                        this.limit = state.perPage;
                        this.orderBy = state.orderBy;
                    }

                    if (!this.opts.pagination.dropdown && this.$refs.pagination) {
                        setTimeout(() => {
                            this.$refs.pagination.Page = state.page;
                        }, 0);
                    }

                    if (this.opts.filterable) {
                        setTimeout(() => {
                            this._setFiltersDOM(state.query);
                        }, 0);
                    }

                    this.activeState = true;
                }
            },
            watch: {
                url() {
                    this.refresh();
                }
            },
            computed: {
                totalPages: require("./computed/total-pages"),
                filteredQuery: require("./computed/filtered-query"),
                hasMultiSort() {
                    return this.opts.serverMultiSorting;
                }
            }
        },
        state
    );

    Vue.component("r-l-server-table", server);
    Vue.component("v-server-table", VtServerTable);

    return VtServerTable;
};
