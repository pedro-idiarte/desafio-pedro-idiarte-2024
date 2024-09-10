export class RecintosZoo {
    constructor() {
      this.recintos = [
        { id: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3, tamanho: 1 }] },
        { id: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
        { id: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1, tamanho: 2 }] },
        { id: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
        { id: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1, tamanho: 3 }] },
      ];
  
      this.animais = {
        LEAO: { tamanho: 3, biomas: ['savana'] },
        LEOPARDO: { tamanho: 2, biomas: ['savana'] },
        CROCODILO: { tamanho: 3, biomas: ['rio'] },
        MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], social: true },
        GAZELA: { tamanho: 2, biomas: ['savana'] },
        HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], precisaEspacoExtra: true }
      };
    }
  
    analisaRecintos(especie, quantidade) {
      if (!this.animais[especie]) {
        return { erro: "Animal inválido", recintosViaveis: null };
      }
      if (quantidade <= 0) {
        return { erro: "Quantidade inválida", recintosViaveis: null };
      }
  
      const animal = this.animais[especie];
      const espacoNecessario = animal.tamanho * quantidade;
      const recintosViaveis = [];
  
      for (const recinto of this.recintos) {
        if (!animal.biomas.includes(recinto.bioma) && !animal.biomas.includes(recinto.bioma.split(" e ")[0])) {
          continue;
        }
  
        let espacoOcupado = recinto.animaisExistentes.reduce((total, a) => total + (a.tamanho * a.quantidade), 0);
        let espacoLivre = recinto.tamanhoTotal - espacoOcupado;
  
        if (animal.social && recinto.animaisExistentes.length === 0) {
          continue;
        }
  
        if (espacoLivre >= espacoNecessario) {
          if (especie === 'LEAO' || especie === 'LEOPARDO') {
            const temHerbivoros = recinto.animaisExistentes.some(a => a.especie !== 'LEAO' && a.especie !== 'LEOPARDO');
            if (temHerbivoros) {
              continue; 
            }
          }
  
          if (especie === 'HIPOPOTAMO') {
            const outraEspecie = recinto.animaisExistentes.length > 0;
            if (outraEspecie && !recinto.bioma.includes('rio')) {
              continue; 
            }
            if (outraEspecie) {
              espacoLivre -= 2; 
            }
          }

          espacoLivre -= espacoNecessario;
  
          if (espacoLivre >= 0) {
            recintosViaveis.push({
              id: recinto.id,
              espacoLivre: espacoLivre,
              tamanhoTotal: recinto.tamanhoTotal
            });
          }
        }
      }
  
      if (recintosViaveis.length === 0) {
        return { erro: "Não há recinto viável", recintosViaveis: null };
      }
  
      recintosViaveis.sort((a, b) => a.id - b.id);
  
      const recintosFormatados = recintosViaveis.map(recinto =>
        `Recinto ${recinto.id} (espaço livre: ${recinto.espacoLivre} total: ${recinto.tamanhoTotal})`
      );
  
      return { erro: null, recintosViaveis: recintosFormatados };
    }
  }
  