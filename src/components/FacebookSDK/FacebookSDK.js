import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class FacebookChatSDK extends Component {
    componentDidMount() {
        this.loadFacebookSDK()
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.loadFacebookSDK()
        }
    }

    loadFacebookSDK() {
        const { location, blockRoutes } = this.props
        const blockRoute = blockRoutes // Thay thế với các route của bạn

        if (blockRoute.includes(location.pathname)) {
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
        // Set attributes for the chatbox
        const chatbox = document.getElementById('fb-customer-chat')
        chatbox.setAttribute('page_id', '149068148278967')
        chatbox.setAttribute('attribution', 'biz_inbox')
    }

    render() {
        return <div id='fb-customer-chat' className='fb-customerchat'></div>
    }
}

export default withRouter(FacebookChatSDK)
