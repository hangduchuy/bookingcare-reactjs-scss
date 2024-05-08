import React, { Component } from 'react'
import { connect } from 'react-redux'
import { totalMoney, dataForBarChart, totalCustomer, getAllUsers } from '../../../../services/userService'
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
            Money: [],
            dataBarChart: [],
            customer: 0,
            selectedYear: new Date().getFullYear() // Năm được chọn mặc định là năm hiện tại
        }
    }

    async componentDidMount() {
        await this.loadDataForYear()
    }

    async loadDataForYear() {
        try {
            const Customers = await totalCustomer()
            const customer = Customers.count
            const money = await totalMoney()
            const moneyByYear=JSON.parse(money)

            const dataToBarChart = await dataForBarChart()
            const datas = await getAllUsers('ALL')

            const data = datas.users

            const counts = Object.keys(data).reduce(
                (acc, key) => {
                    if (data[key].roleId === 'R3') {
                        if (data[key].gender === 'M') {
                            acc.Male += 1
                        } else if (data[key].gender === 'F') {
                            acc.Female += 1
                        }
                    }
                    return acc
                },
                { Male: 0, Female: 0 }
            )

            this.setState({
                Male: counts.Male,
                Female: counts.Female,
                Money: moneyByYear,
                dataBarChart: dataToBarChart,
                customer: customer
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    handleYearChange = async (event) => {
        const year = parseInt(event.target.value)
        await this.loadDataForYear(year)
        this.setState({ selectedYear: year })
    }

    render() {
        const { Male, Female, Money, dataBarChart, customer, selectedYear } = this.state
        const data = {
            labels: ['Bệnh nhân nam', 'Bệnh nhân nữ'],
            datasets: [
                {
                    data: [Male, Female],
                    backgroundColor: ['#73C6D9', '#F2BBC9']
                }
            ]
        }

        const selectedYearDataChart = dataBarChart[this.state.selectedYear] || []
        const selectedYearMoney = Money[this.state.selectedYear] || []

        const data1 = {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            datasets: [
                {
                    label: 'Bill in Month',
                    data: selectedYearDataChart,

                    backgroundColor: '#778899',
                    borderColor: 'black',
                    borderWidth: 1
                }
            ]
        }
        const options = {}
        const differ = Math.round((selectedYearMoney - Money[selectedYear - 1]) / Money[selectedYear - 1] * 100);
        
        return (
            <div className='report-container'>
                <div className='mb-5' style={{ display: 'flex', gap: '5px' }}>
                    <OverviewBudget difference={differ} positive sx={{ height: '100%' }} value={`${selectedYearMoney}`} />
                    <OverviewTotalCustomers
                        // difference={0}
                        // positive={false}
                        // sx={{ height: '100%' }}
                        value={`${customer}`}
                    />
                </div>
                <div style={{ display: 'flex', height: '50%' }}>
                    <div style={{ padding: '20px', width: '50%' }}>
                        <select value={selectedYear} onChange={this.handleYearChange}>
                            <option value={2022}>2022</option>
                            <option value={2023}>2023</option>
                            <option value={2024}>2024</option>
                            {/* Thêm các option cho các năm khác nếu cần */}
                        </select>
                        <Bar data={data1} options={options}></Bar>
                    </div>
                    <div style={{ padding: '20px auto', width: '50%' }}>
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
