class BaseHandler {
    public typeName: string;

    constructor(typeName: string) {
        this.typeName = typeName;
    }

    public async isMatch(type: string): Promise<boolean> {
        return (type === this.typeName);
    }
}

export default BaseHandler;
