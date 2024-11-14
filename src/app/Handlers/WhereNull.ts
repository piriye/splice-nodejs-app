import { QueryBuilderInterface } from "App/Interfaces/QueryBuilderInterface";
import BaseHandler from "./BaseHandler";

class WhereNull extends BaseHandler implements QueryBuilderInterface {
    public typeName: string;

    constructor() {
        const typeName = 'where_null'
        super(typeName);
        this.typeName = typeName;
    }

    // parameter => "where_null=deleted_at"
    public async addQuery(model, parameter) {
        model.whereNull(parameter);

        return model;
    }
}

export default WhereNull;
