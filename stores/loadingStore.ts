import {makeAutoObservable} from "mobx";

class LoadingStore {
	private _loading: boolean = false;

	constructor()
	{
		makeAutoObservable(this);
	}

	get loading(): boolean {
		return this._loading;
	}

	set loading(value: boolean) {
		this._loading = value;
	}
}

export const loadingStore = new LoadingStore();
