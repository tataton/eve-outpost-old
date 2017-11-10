import React from 'react';
import { Menu, Image } from 'semantic-ui-react';

const FixedMenu = ({isLoadingCharacter, isLoggedIn, loggedInCharacterName, loggedInCharacterID}) => {

    const rightMenuItem = () => {
        if (!isLoadingCharacter && !isLoggedIn) {
            return (
                <Image
                    src='images/EVE_SSO_Login_Buttons_Large_White.png'
                    as='a'
                    href='/auth/read/login'
                />
            )
        } else if (!isLoadingCharacter && isLoggedIn) {
            const imgSrc = `http://image.eveonline.com/Character/${loggedInCharacterID}_32.jpg`;
            return (
                <div>
                    <p style={{ display: 'inline' }}>
                        Logged in as: {loggedInCharacterName}
                    </p>
                    <img 
                        src={imgSrc}
                        style={{ display: 'inline' }}
                    />
                </div>
            )
        }
    };

    return (
        <Menu fixed='top' inverted>
            <Menu.Item>
                <Image 
                    size='mini'
                    as='a'
                    src='images/Factory.png'
                    style={{ marginRight: '1.5em' }}
                />
                EVE Outpost
            </Menu.Item>
            <Menu.Item as='a'>Home</Menu.Item>
            <Menu.Item as='a'>Market Viewer</Menu.Item>
            <Menu.Item position='right'>
                {rightMenuItem()}
            </Menu.Item>
        </Menu>
    )
}

export default FixedMenu;