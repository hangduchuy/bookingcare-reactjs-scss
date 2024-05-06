import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class FacebookChatSDK extends Component {
    componentDidMount() {
        this.loadFacebookSDK()
        console.log()
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.loadFacebookSDK()
        }
    }

    loadFacebookSDK() {
        const { location } = this.props
        const allowedRoutes = ['/home'] // Thay thế với các route của bạn

        if (!allowedRoutes.includes(location.pathname)) {
            return // Không load Chat nếu không ở trong các route cho phép
        }

        if (window.FB) {
            this.initializeSDK()
        } else {
            // Load Facebook SDK
            window.fbAsyncInit = this.initializeSDK
            ;(function (d, s, id) {
                var js,
                    fjs = d.getElementsByTagName(s)[0]
                if (d.getElementById(id)) return
                js = d.createElement(s)
                js.id = id
                js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js'
                fjs.parentNode.insertBefore(js, fjs)
            })(document, 'script', 'facebook-jssdk')
        }
    }

    initializeSDK() {
        window.FB.init({
            xfbml: true,
            version: 'v18.0'
        })
    }

    render() {
        return <div id='fb-customer-chat' className='fb-customerchat'></div>
    }
}

export default withRouter(FacebookChatSDK)
