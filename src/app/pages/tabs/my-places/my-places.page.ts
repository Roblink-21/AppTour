import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { Place } from 'src/app/models/places';
import { FireStorageService } from 'src/app/services/firesStorage/fire-storage.service';
import { FirestoreService } from 'src/app/services/firesStore/firestore.service';


@Component({
  selector: 'app-my-places',
  templateUrl: './my-places.page.html',
  styleUrls: ['./my-places.page.scss'],
})
export class MyPlacesPage implements OnInit {

  places: Place[] = [];

  newPlace: Place;

  private path = 'Lugares/';
  newImage = '';
  newFile = '';

  loading: any;

  constructor(
    public menucontroler: MenuController,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageService: FireStorageService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getItems();
  }
  getItems() {
    this.firestoreService
      .getCollection<Place>(this.path)
      .subscribe((res) => {
        this.places = res;
      });
  }

  async deleteItem(place: Place) {
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: 'Seguro desea <strong>eliminar<strong>!',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirmar cancelar');
          },
        },
        {
          text: 'OK',
          handler: () => {
            console.log('Confirmar OK');
            this.firestoreService
              .deleteDoc(this.path, place.id)
              .then((res) => {
                this.loading.dismiss();
                this.presentToast('Eliminado con éxito');
              })
              .catch((err) => {
                this.presentToast('No se pudo eliminar :(');
              });
          },
        },
      ],
    });

    await alert.present();
    //
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

  async edit(place: Place){

    this.firestoreService
      .getCollection<Place>(this.path)
      .subscribe((res) => {
        this.places = res;
      });



  }

}

