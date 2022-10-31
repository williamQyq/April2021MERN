const IconCover = (props) => {
    const { Icon } = props;
    return (
        <div
            style={{
                height: 280,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Icon style={{ fontSize: "500%" }} />
        </div>
    );
}

export default IconCover;