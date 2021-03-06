import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Entry } from "../../models/entry"
import { EntryDataServiceProvider } from "../../providers/entry-data-service/entry-data-service"
import { Camera, CameraOptions } from '@ionic-native/camera';

const PLACEHOLDER_IMAGE: string = "/assets/imgs/placeholder.png";
const SPINNER_IMAGE: string = "/assets/imgs/spinner.gif";

@Component({
  selector: 'page-entry-detail',
  templateUrl: 'entry-detail.html',
})
export class EntryDetailPage {
  private entry: Entry;
  private image = PLACEHOLDER_IMAGE;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, private entryDataService: EntryDataServiceProvider,
    private camera: Camera){
    
    
    let entryID = this.navParams.get("entryID");

    if (entryID === undefined) {
      this.entry = new Entry();
      this.entry.title = "";
      this.entry.text = "";
      this.entry.id = -1; // placeholder for 'temporary' entry
    } else {
      this.entry = this.entryDataService.getEntryByID(entryID);
      this.image = this.entry.image;
    }
    console.log("entry is ", this.entry);
  }

  private saveEntry(){
    this.entry.image = this.image;
    if (this.entry.id == -1){
     this.entryDataService.addEntry(this.entry);
    } else {
      this.entryDataService.updateEntry(this.entry.id, this.entry);
    }
    
    this.navCtrl.pop();
    console.log("Now I would save the entry: ", this.entry);
  }

  private cancelEditing(){
    this.navCtrl.pop();
  }
  
  private takePic(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      if (imageData) {
        this.image = 'data:image/jpeg;base64,' + imageData;        
      } 
     }, (err) => {
     });



  }
}
