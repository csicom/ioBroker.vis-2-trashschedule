import React from 'react';
import PropTypes from 'prop-types';

import { Box, CircularProgress } from '@mui/material';

import Color from 'color';
import moment from 'moment';
import 'moment/locale/de';

import Trashcan from './Components/trashcan';

const styles = {
    trashList: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        gap: '0.8em',
        flexWrap: 'nowrap',
        // overflowX: 'auto',
        // whiteSpace: 'nowrap',
        // margin: '16 0 16 0',
        // borderRadius: 4,
        // marginLeft: 12,
    },
    trashItem: {
        width: '100%',
        display: 'block',
        // flexBasis: 0,
        // flexGrow: 1,
        // backgroundColor: 'red',
    },
};

class TrashScheduleWidget extends window.visRxWidget {
    constructor(props) {
        super(props);
        this.state.trashDataObj = [];
        this.state.colorData = [];
        this.widgetRef = React.createRef();
    }

    static getWidgetInfo() {
        return {
            id: 'tplTrashScheduleWidget',
            visSet: 'vis-2-trashschedule',
            visSetLabel: 'vis_2_widgets_template', // Widget set translated label (should be defined only in one widget of a set)
            visSetColor: '#2579b7',                // Color of a widget set. it is enough to set color only in one widget of a set
            visName: 'TrashSchedule',                 // Name of widget
            visWidgetLabel: 'TrashSchedule',  // Label of widget
            visAttrs: [
                {
                    name: 'common', // group name
                    fields: [
                        {
                            name: 'noCard',
                            label: 'without_card',
                            type: 'checkbox',
                        },
                        {
                            name: 'widgetTitle',
                            label: 'name',
                            hidden: '!!data.noCard',
                        },
                        {
                            name: 'trashschedule_oid',
                            type: 'id',
                            label: 'trashschedule_oid',
                            default: 'trashschedule.0.type.json',
                        },
                        {
                            name: 'limit',
                            type: 'slider',
                            min: 1,
                            max: 10,
                            step: 1,
                            label: 'limit',
                            default: 4,
                        },
                        {
                            name: 'size_factor',
                            type: 'slider',
                            min: 0,
                            max: 1,
                            step: 0.1,
                            label: 'size_factor',
                            default: 0.5,
                            hidden: data =>
                                data.limit >= 4,
                        },
                        {
                            name: 'glow',
                            type: 'checkbox',
                            label: 'glow',
                        },
                        {
                            name: 'glow_limit',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            label: 'glowLimit',
                            default: 1,
                            hidden: '!data.glow',
                        },
                        {
                            name: 'glowColor',
                            type: 'color',
                            label: 'glow_Color',
                            hidden: '!data.glow',
                        },
                        {
                            name: 'glow2dColor',
                            type: 'color',
                            label: 'glow_2dColor',
                            hidden: '!data.glow',
                        },
                        {
                            name: 'showCompleted',
                            type: 'checkbox',
                            label: 'show_completed',
                            default: false,
                            hidden: '!data.glow',
                        },
                        {
                            name: 'completedColor',
                            type: 'color',
                            label: 'completed_Color',
                            hidden: data =>
                                !data.glow || !data.showCompleted,
                        },
                        {
                            name: 'showName',
                            type: 'checkbox',
                            label: 'showName',
                            default: true,
                        },
                        {
                            name: 'showDate',
                            type: 'checkbox',
                            label: 'showDate',
                            default: true,
                        },
                        {
                            name: 'dateLocale',
                            type: 'select',
                            options: [
                                { value: 'de', label: 'german' },
                                { value: 'en-gb', label: 'english' },
                            ],
                            default: 'de',
                            label: 'dateLocale',
                        },                        {
                            name: 'dateWeekday',
                            label: 'dateWeekday',
                            type: 'select',
                            options: [
                                { value: 'long', label: 'long' },
                                { value: 'short', label: 'short' },
                                { value: 'hide', label: 'hide' },
                            ],
                            default: 'long',
                        },
                    ],
                },
                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visDefaultStyle: {
                width: '100%',
                height: 'auto',
                position: 'relative',
            },
            visPrev: 'widgets/vis-2-trashschedule/img/trashschedule.png',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    async propertiesUpdate() {
        const actualRxData = JSON.stringify(this.state.rxData);
        if (this.lastRxData === actualRxData) {
            return;
        }

        const newState = {};
        this.lastRxData = actualRxData;
        const ids = [];
        if (this.state.rxData.trashschedule_oid && this.state.rxData.trashschedule_oid !== 'nothing_selected') {
            ids.push(this.state.rxData.trashschedule_oid);
        }
        const _objects = ids.length ? (await this.props.context.socket.getObjectsById(ids)) : {};
        if (this.state.rxData.trashschedule_oid && this.state.rxData.trashschedule_oid !== 'nothing_selected') {
            const trashscheduleStateObj = _objects[this.state.rxData.trashschedule_oid];
            newState.trashscheduleStateObject = { common: trashscheduleStateObj.common, _id: trashscheduleStateObj._id };
        } else {
            newState.trashscheduleStateObject = null;
        }
        Object.keys(newState).find(key => JSON.stringify(this.state[key]) !== JSON.stringify(newState[key])) && this.setState(newState);
 
     }

    componentDidMount() {
        super.componentDidMount();

        // Update data
        this.propertiesUpdate();
    }

    // To not write before every label "vis_2_widgets_template_" we can use this method
    static getI18nPrefix() {
        return 'vis_2_widgets_trashschedule_';
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return TrashScheduleWidget.getWidgetInfo();
    }

    // This function is called every time when rxData is changed
    // eslint-disable-next-line class-methods-use-this
    onRxDataChanged() {
        this.propertiesUpdate();
    }

    // This function is called every time when rxStyle is changed
    // eslint-disable-next-line class-methods-use-this
    onRxStyleChanged() {
    }

    // This function is called every time when some Object State updated, but all changes lands into this.state.values too
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    async onStateUpdated(id, state) {
        // console.log('onupdateState');
        if (id === this.state.rxData.trashschedule_oid) {
            await this.generateTrashData(state.val);
        }
    }

    async generateTrashData(trashData) {
        const _trashDataObj = await JSON.parse(trashData);
        const trashDataObj = this.state.rxData.showCompleted ? _trashDataObj : _trashDataObj.filter(obj=>obj._completed===false);    
        await this.setState(() => ({
            trashDataObj,
        }));

        await this.generateColorData(trashDataObj);
    }

    async generateColorData(trashDataObj) {
        trashDataObj = trashDataObj || this.state.trashDataObj
        const coloringData = [0, -33, -19, -14, -11, -10, 8, 10, 11];
        const colorData = [];
        let  _colorData = [];
        trashDataObj.forEach(trash => {
            coloringData.forEach(coloring => {
                let color = Color.hsl(trash._color);
                const _color = color.hsl().array();
                //Farbkorrektur, muss geprüft werden, ob das nötig ist
                // if (_color[2] < 33) {
                //     _color[2] = (33 - _color[2]);
                // }
                // if (_color[2] > 89) {
                //     _color[2] = -(_color[2] - 89);
                // }
                _color[2] += coloring;
                color = Color.hsl(_color);
                _colorData.push(color.hex());
            });
            colorData.push(_colorData);
            _colorData = [];
        });
        this.setState(() => ({
            colorData,
        }));
    }

    async componentDidUpdate() {
        // console.log('onupdateComponente');
        if (super.componentDidUpdate) {
            super.componentDidUpdate();
        }

        if (this.refService?.current) {
            let w = this.refService.current.clientWidth;
            let h = this.refService.current.clientHeight;
            // console.log(w);
            // const size = w;
            let size = 0;
            const widget = this.props.context.views[this.props.view].widgets[this.props.id];
            if (!this.state.rxData.noCard && !widget.usedInWidget) {
                h -= 32; // padding
                w -= 32; // padding
            }

            const withTitle = this.state.rxData.widgetTitle && !this.state.rxData.noCard && !widget.usedInWidget;

            if (withTitle) {
                h -= 36 + 28;
            }
            if (h < 0) {
                h = 0;
            }

            // // with title and with modes
            if (w > h) {
                size = w;
            } else {
                size = h;
            }

            if (size < 80) {
                size = 0;
            }

            // console.log(size);
            if (size !== this.state.size) {
                this.setState({ size });
            }
        }
    }

    renderWidgetBody(props) {
        // console.log(this);
        super.renderWidgetBody(props);

        const actualRxData = JSON.stringify(this.state.rxData);
        if (this.lastRxData !== actualRxData) {
            this.updateTimeout =
                this.updateTimeout ||
                setTimeout(async () => {
                    this.updateTimeout = null;
                    await this.propertiesUpdate();
                    if(this.state.values[this.state.rxData.trashschedule_oid + '.val']){
                        await this.generateTrashData(this.state.values[this.state.rxData.trashschedule_oid + '.val']);
                    }
                }, 50);
        }
       
        const noCard = this.state.rxData.noCard || props.widget.usedInWidget;

        const style = {
            width: '100%',
            height: !noCard && this.state.rxData.widgetTitle ? 'calc(100% - 36px)' : '100%',
            border: '0',
        };
        Object.keys(this.state.rxStyle).forEach(key => {
            if (key !== 'position' && key !== 'top' && key !== 'left' && key !== 'width' && key !== 'height') {
                if (this.state.rxStyle[key] !== undefined && this.state.rxStyle[key] !== null) {
                    if (key.includes('-')) {
                        const val = this.state.rxStyle[key];
                        key = key.replace(/-./g, x => x[1].toUpperCase());
                        style[key] = val;
                    } else {
                        style[key] = this.state.rxStyle[key];
                    }
                }
            }
        });

        function getDate(locale, date, type) {
            let _date = null;
            moment.locale(locale);
            const rdate = moment(date);
            switch (type) {
                case 'long':
                    _date = locale === 'de' ? rdate.format('dddd DD.MM.') : rdate.format('dddd MM/DD');
                    break;
                case 'short':
                    _date = locale === 'de' ? rdate.format('dd DD.MM.') : rdate.format('dd MM/DD');
                    break;
                case 'hide':
                    _date = locale === 'de' ? rdate.format('D.M.') : rdate.format('M/D');
                    break;
                default:
                    _date = locale === 'de' ? rdate.format('dddd DD.MM.') : rdate.format('dddd MM/DD');
            }
            return _date;
        }

        const trashItems = this.state.trashDataObj.length ?
            this.state.trashDataObj.map((trashItem, id) => (
                (id < this.state.rxData.limit) ?
                    <div
                        id={id}
                        style={{ ...styles.trashItem }}
                        width={Math.round((this.state.size -36) / this.state.rxData.limit)}
                    >
                        {this.state.rxData.showName ? <div
                            style={{
                                width: '100%',
                                height: 'auto',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: Math.round(((this.state.size -40) / ((this.state.rxData.limit <= 3) ? 2  / this.state.rxData.size_factor : this.state.rxData.limit)) / 9),
                                marginBottom: 6,
                            }}
                        >
                            {trashItem.name}
                        </div> : null}

                        <div
                            style={{
                                width: Math.round(((this.state.size -40) / ((this.state.rxData.limit <= 3) ? 2 / this.state.rxData.size_factor : this.state.rxData.limit)) - 20),
                                height: 'auto',
                                margin: 'auto',
                            }}
                        >
                            <Trashcan
                                id={id}
                                color={this.state.colorData[id]}
                                daysLeft={trashItem.daysLeft}
                                width='100%'
                                glow={this.state.rxData.glow && (this.state.rxData.glow_limit >= trashItem.daysLeft)}
                                completed={trashItem._completed}
                                glowColor={this.state.rxData.glowColor}
                                glow2dColor={this.state.rxData.glow2dColor}
                                completedColor= {this.state.rxData.completedColor}
                            >
                            </Trashcan>
                        </div>
                        {this.state.rxData.showDate ? <div
                            style={{
                                width: '100%',
                                height: 'auto',
                                textAlign: 'center',
                                fontSize: Math.round(((this.state.size -40) / ((this.state.rxData.limit <= 3) ? 2 / this.state.rxData.size_factor : this.state.rxData.limit)) / 10),
                            }}
                        >
                            {getDate(this.state.rxData.dateLocale, trashItem.nextDate, this.state.rxData.dateWeekday)}
                        </div> : null}
                    </div> : null
            ))
            : null;
        const trash = trashItems ?
            <Box
                id={`${props.id}_trashlist`}
                style={{
                    ...styles.trashList,
                    height: !noCard && this.state.rxData.widgetTitle ? 'calc(100% - 36px)' : '100%',
                }}
                sx={{
                    '::-webkit-scrollbar': {
                        width: '3px',
                    },
                }}
            >
                {trashItems}
            </Box>
            : null;

        const content = trash || <CircularProgress color="secondary" />;

        if (noCard) {
            return content;
        }

        return this.wrapContent(content);
    }
}

TrashScheduleWidget.propTypes = {
    context: PropTypes.object,
    themeType: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.object,
};

export default TrashScheduleWidget;
