const IconCover = (props) => {
    const { Icon } = props;
    return (
        <div
            style={{
                width: 400,
                height: 400,
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