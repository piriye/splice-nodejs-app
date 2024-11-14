import { QueryBuilderInterface } from "App/Interfaces/QueryBuilderInterface";
import BaseHandler from "./BaseHandler";

class WhereLT extends BaseHandler implements QueryBuilderInterface {
    public typeName: string;

    constructor() {
        const typeName = 'where_lt'
        super(typeName);
        this.typeName = typeName;
    }

    // parameter => "where=type:merchant,parent_model_type:user"
    public async addQuery(model, parameter) {
        const queryParameters = parameter.split(',');

        for (const queryKey in queryParameters) {
            const queryParameter = queryParameters[queryKey];
            const result = queryParameter.split(':');
            
            model.where(result[0], '<', result[1]);
        }

        return model;
    }
}

export default WhereLT;
