export const adminMenu = [
    {
        //quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.report',
                link: '/system/report'
            },
            {
                name: 'menu.admin.crud-redux',
                link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-doctor',
                link: '/system/manage-doctor'
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
                // ]
            },
            // {
            //     name: 'menu.admin.manage-admin', link: '/system/user-admin'
            // },
            {
                //quản lý kế hoạch khám bệnh của bác sĩ
                name: 'menu.doctor.manage-schedule',
                link: '/system/manage-schedule'
            }
        ]
    },
    {
        //quản lý phòng khám
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic',
                link: '/system/manage-clinic'
            }
        ]
    },
    {
        //quản lý chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty',
                link: '/system/manage-specialty'
            }
        ]
    },
    {
        //quản lý cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook',
                link: '/system/manage-handbook'
            }
        ]
    }
]

export const doctorMenu = [
    {
        //quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
            {
                //quản lý kế hoạch khám bệnh của bác sĩ
                name: 'menu.doctor.manage-schedule',
                link: '/doctor/manage-schedule'
            },
            {
                //quản lý bệnh nhân khám bệnh của bác sĩ
                name: 'menu.doctor.manage-patient',
                link: '/doctor/manage-patient'
            }
        ]
    }
]
export const assistantMenu = [
    { //quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
            // { //quản lý kế hoạch khám bệnh của bác sĩ
            //     name: 'menu.assistant.manage-schedule', link: '/assistant/manage-schedule'
            // },
            { //quản lý bệnh nhân khám bệnh của bác sĩ
                name: 'menu.assistant.manage-patient', link: '/assistant/manage-patient'
            },
        ]
    }
];