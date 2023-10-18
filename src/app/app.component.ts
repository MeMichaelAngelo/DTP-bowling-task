import { Component } from '@angular/core';
import { PlayersInformation } from 'src/interfaces/playersInformation.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  playersList: PlayersInformation[] = [];
  numberOfAllThrows: number[] = [...Array(21).keys()];

  openFile(event: Event): void {
    const inputElement = event?.target as HTMLInputElement;
    const file = inputElement?.files?.[0];

    if(file) {
      const reader = new FileReader();

        reader.onload = (event) => { 
          const fileContents = event.target?.result as string;
          const preparedData = fileContents.split('\n').map(el => el.replace(/\r/g, ''))

          this.createPlayersList(preparedData);
        };
      reader.readAsText(file);
    }
  }

  private createPlayersList(data: string[]): void {
    this.playersList = [];

    for(let i=0; i<data.length; i=i+2) {
      this.playersList.push(
        {
          name: data[i],
          points: (data[i+1].split(',')).map(el => Number(el))
        }
      )
    }
    this.calculationOfPoints();
  }

  private calculationOfPoints(): void {
    this.playersList = this.playersList.map((player: PlayersInformation) => {
    let total = 0;
    let strikeFlag = false;
    let spareFlag = false;
    
    for(let i = 0; i < player.points.length; i=i+2) {
			const firstThrow = player.points[i];
      const secondThrow = player.points[i+1];
      const sumOfBothThrows = firstThrow + secondThrow;
      
    	if(i !== 20) {
      	total += sumOfBothThrows;
      }
      
      if(strikeFlag) {
       total += sumOfBothThrows;
      }
      
      if(spareFlag) {
       total += firstThrow;
      }

      strikeFlag = firstThrow === 10 ? true : false;
    	spareFlag = sumOfBothThrows === 10 ? true : false;

    }
    return {
    	...player,
      total,
    }
    });
  }
}