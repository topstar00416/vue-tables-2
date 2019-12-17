import RLPerPageSelector from "./renderless/RLPerPageSelector";

export default {
    name: 'VtPerPageSelector',
    components: {RLPerPageSelector},
    render() {
        return <r-l-per-page-selector scopedSlots={
            {
                default: function (props) {
                    return props.override ? h(props.override, {attrs:{props}}) : <div class="VueTables__limit-field">
                            <label class={props.labelClass} for={`VueTables__limit_${props.id}`}>
                                {props.display('limit')}
                            </label>
                            <select id={props.selectAttrs.id} class={props.selectAttrs.class} value={props.selectAttrs.value} on-change={props.selectEvents.change}
                            >
                                {props.perPageValues.map(val => {
                                    return <option value={val}>{val}</option>
                                })}
                            </select>
                    </div>
                }
            }
        }
        >

        </r-l-per-page-selector>
    }
}
