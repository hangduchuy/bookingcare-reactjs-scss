import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './FacebookSDK.scss'
class FacebookChatSDK extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shouldRenderChat: true // Mặc định cho phép render
        }
    }
    componentDidMount() {
        const { location, blockRoutes } = this.props
        const blockRoute = blockRoutes
        const shouldRenderChat = !blockRoute.some((route) => location.pathname.includes(route))
        this.setState({ shouldRenderChat })
    }

    render() {
        if (!this.state.shouldRenderChat) {
            return null
        }

        return (
            <a
                target='_blank'
                rel='noopener noreferrer'
                className='text-white'
                href='https://www.facebook.com/messages/t/149068148278967'
            >
                <div className='fb-customerchat'></div>
            </a>
        )
    }
}

export default withRouter(FacebookChatSDK)
