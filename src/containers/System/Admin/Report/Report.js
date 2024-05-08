import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllDoctors, totalMoney, dataForBarChart, totalCustomer } from '../../../../services/userService'
import { Doughnut, Bar } from 'react-chartjs-2'
import { OverviewBudget } from './Overview-budget'
import { OverviewTotalCustomers } from './Overview-totalEmployee'
import './Report.scss'
class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Male: 0,
            Female: 0,
            Money: 0,
            dataBarChart: [],
            customer: 0
        }
    }

    async componentDidMount() {
        try {
            const Customers = await totalCustomer()
            const customer = Customers.count
            const money = await totalMoney()
            const dataToBarChart = await dataForBarChart()
            const datas = await getAllDoctors()
            const data = datas.data
            // Sử dụng Array.reduce để đếm số lượng Male và Female
            const counts = Object.keys(data).reduce(
                (acc, key) => {
                    if (data[key].gender === 'M') {
                        acc.Male += 1
                    } else if (data[key].gender === 'F') {
                        acc.Female += 1
                    }
                    return acc
                },
                { Male: 0, Female: 0 }
            )

            // Cập nhật trạng thái với số lượng đã đếm được
            this.setState({
                Male: counts.Male,
                Female: counts.Female,
                Money: money,
                dataBarChart: dataToBarChart,
                customer: customer
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    render() {
        const { Male, Female, Money, dataBarChart, customer } = this.state

        const data = {
            labels: ['Male Customers', 'Customers Female'],
            datasets: [
                {
                    data: [Male, Female],
                    backgroundColor: ['#73C6D9', '#F2BBC9']
                }
            ]
        }
        const data1 = {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            datasets: [
                {
                    label: 'Bill in Month',
                    data: dataBarChart,
                    backgroundColor: '#778899',
                    borderColor: 'black',
                    borderWidth: 1
                }
            ]
        }
        const options = {}

        return (
            <div className='report-container'>
                <div className='mb-5' style={{ display: 'flex', gap: '5px' }}>
                    <OverviewBudget
                        difference={12}
                        positive
                        sx={{ height: '100%' }}
                        value={`${Money}`}
                    ></OverviewBudget>
                    <OverviewTotalCustomers
                        difference={16}
                        positive={false}
                        sx={{ height: '100%' }}
                        value={`${customer}`}
                    ></OverviewTotalCustomers>
                </div>
                <div style={{ display: 'flex', height: '50%' }}>
                    <div
                        style={{
                            padding: '20px',
                            width: '50%'
                        }}
                    >
                        <Bar data={data1} options={options}></Bar>
                    </div>
                    <div
                        style={{
                            padding: '20px auto',
                            width: '50%'
                        }}
                    >
                        <Doughnut data={data} options={options}></Doughnut>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
