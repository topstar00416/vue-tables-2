import RLTableCell from "./renderless/RLTableCell";

export default {
    name: 'VtTableCell',
    props: ['column'],
    components: { RLTableCell },
    render() {
        return <r-l-table-cell column={this.column} scopedSlots={
            {
                default: (props) => {
                    return props.override ? h(props.override, {attrs:{props}}) : <td tabindex={props.tabIndex} class={props.classes}>
                        {props.content}
                    </td>
                }
            }
        }
        >
        </r-l-table-cell>
    }
}
