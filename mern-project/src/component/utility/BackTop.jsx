import { BackTop } from "antd";
const BackTopHelper = (props) => {
    const style = {
        height: 40,
        width: 40,
        lineHeight: '40px',
        borderRadius: 4,
        backgroundColor: '#1088e9',
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
    };

    return (
        <div style={{ height: '600vh', padding: 8 }}>
            <div>Scroll to bottom</div>
            <div>Scroll to bottom</div>
            <div>Scroll to bottom</div>
            <div>Scroll to bottom</div>
            <div>Scroll to bottom</div>
            <div>Scroll to bottom</div>
            <div>Scroll to bottom</div>
            <BackTop target={() => document.getElementsByClassName('ant-layout-content site-layout-content')}>
                <div style={style}>UP</div>
            </BackTop>
        </div>
    );
}

export default BackTopHelper;