import React, { Component } from 'react'
import { connect } from 'react-redux'
import 'mapbox-gl/dist/mapbox-gl.css'
import Map, { Marker, NavigationControl, Popup, FullscreenControl, GeolocateControl } from 'react-map-gl'
import { getClinicDoctorById } from '../../../services/userService'

class MapDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataClinic: {}
        }
    }

    async componentDidMount() {
        this.getDataClinic()
    }

    getDataClinic = async () => {
        let doctorId = +this.props.doctorIdFromParent
        let res = await getClinicDoctorById({ doctorId: doctorId })
        if (res && res.errCode === 0) {
            this.setState({
                dataClinic: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.language !== prevProps.language) {
        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            this.getDataClinic()
        }
    }

    render() {
        let { dataClinic } = this.state

        return (
            <div className='App'>
                <h2>Địa điểm khám</h2>
                {dataClinic && dataClinic.Clinic && dataClinic.Clinic.longitude && dataClinic.Clinic.latitude && (
                    <Map
                        mapboxAccessToken={process.env.REACT_APP_MAP_KEY}
                        style={{
                            width: '600px',
                            height: '600px',
                            borderRadius: '15px',
                            border: '1px solid red'
                        }}
                        initialViewState={{
                            longitude: dataClinic.Clinic.longitude,
                            latitude: dataClinic.Clinic.latitude,
                            zoom: 14
                        }}
                        mapStyle='mapbox://styles/mapbox/streets-v9'
                    >
                        <NavigationControl position='bottom-right' />
                        <FullscreenControl />
                        <GeolocateControl />
                        <Popup
                            latitude={dataClinic.Clinic.latitude}
                            longitude={dataClinic.Clinic.longitude}
                            // closeButton={true}
                            // closeOnClick={true}
                            anchor='top-right'
                        >
                            <div>{dataClinic.Clinic.name}</div>
                        </Popup>
                        <Marker longitude={dataClinic.Clinic.longitude} latitude={dataClinic.Clinic.latitude} />
                    </Map>
                )}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(MapDoctor)
