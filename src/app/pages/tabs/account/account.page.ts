import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { Router } from '@angular/router';

import { Place } from 'src/app/models/places';
import { FireStorageService } from 'src/app/services/firesStorage/fire-storage.service';
import { FirestoreService } from 'src/app/services/firesStore/firestore.service';
import { GooglemapsComponent } from 'src/app/googlemaps/googlemaps.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  places: Place[] = [];

  newPlace: Place;

  enableNewPlace = false;

  private path = 'Lugares/';
  newImage = '';
  newFile = '';

  loading: any;

  // cliente: Client = {
  //   uid: '',
  //   name: '',
  //   email: '',
  //   phoneNumber: '',
  //   image: '',
  //   description: '',
  //   ubication: null,
  // };

  constructor(
    public menucontroler: MenuController,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageService: FireStorageService,
    public modalController: ModalController,
    private router: Router,
  ) {}

  ngOnInit() {

  }

  openMenu() {
    this.menucontroler.toggle('first');
  }
  async saveItem() {
    this.presentLoading();
    const path = 'Lugares';
    const name = this.newPlace.name;
    const res = await this.firestorageService.uploadImage(
      this.newFile,
      path,
      name
    );
    this.newPlace.image = res;
    this.firestoreService
      .createDoc(this.newPlace, this.path, this.newPlace.id)
      .then((res) => {
        this.loading.dismiss();
        this.presentToast('Guardado con éxito');
        this.router.navigateByUrl('/tabs/my-places', { replaceUrl: true });
      })
      .catch((err) => {
        this.presentToast('No se pudo guardar :(');
      });
  }

  newItem() {
    this.enableNewPlace = true;

    this.newPlace = {
      name: '',
      price: null,
      description: '',
      image: '',
      ubication: null,
      id: this.firestoreService.getId(),
      fecha: new Date(),
    };
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'Guardando...',
    });
    await this.loading.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'normal',
      color: 'Light',
    });
    toast.present();
  }

  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (image) => {
        this.newPlace.image = image.target.result as string;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async addDirection() {
    const location = this.newPlace.ubication;
    let positionInput = {
      lat: 0,
      lng: 0,
    };
    if (location !== null) {
      positionInput = location;
    }

    const modalAdd = await this.modalController.create({
      component: GooglemapsComponent,
      componentProps: { position: positionInput },
    });
    await modalAdd.present();

    const { data } = await modalAdd.onWillDismiss();
    if (data) {
      console.log('data -> ', data);
      this.newPlace.ubication = data.pos;
      console.log('this.newRestaurant -> ', this.newPlace);
    }
  }

}
