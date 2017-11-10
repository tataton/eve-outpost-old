const http = {
    fetchUser: () => {
        fetch('/auth/getuserinfo', {
            credentials: 'include'  
        })
    }
};

export default http;