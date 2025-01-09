import { MapModel } from "./MapModel";

export class MapEditContext {
    private readonly _mapModel: MapModel;

    constructor(mapModel: MapModel) {
        this._mapModel = mapModel;
    }    

    get mapModel(): MapModel {
        return this._mapModel;
    }
}