import { Pipe, PipeTransform } from '@angular/core';

enum TipoConversao {
    Binario,
    Decimal
}

@Pipe({
    name: 'decimalBinario'
})
export class DecimalBinarioPipe implements PipeTransform {

    transform(value: string | number, args: string = TipoConversao[TipoConversao.Binario], allowNotify: string = ''): unknown {
        if (args !== TipoConversao[TipoConversao.Binario] && args !== TipoConversao[TipoConversao.Decimal]) {
            args = TipoConversao[TipoConversao.Binario];
        }
        let numInt = null;
        let numDec = null;

        value = String(value).replace(',', '.');

        if (value.indexOf('.') === -1) {
            numInt = value;
        } else {
            numInt = value.substring(0, value.indexOf('.'));
            numDec = value.substring(value.indexOf('.') + 1,);
        }

        if (
            allowNotify &&
            (String(numInt).match(/[^0-9]/g) || String(numDec).match(/[^0-9]/g)) &&
            (isNaN(numInt) || isNaN(numDec))) {
            return allowNotify;
        } else if (
            String(numInt).match(/[^0-9]/g) || String(numDec).match(/[^0-9]/g) &&
            (isNaN(numInt) || isNaN(numDec))) {
            return null;
        }

        value = typeof (value) === 'number' ? '' + value : value;

        if (args === TipoConversao[TipoConversao.Binario]) {
            if (value.match(/[^0-1.]/g)) return allowNotify ?? null;

            let valueArrayInt = numInt.split('').reverse();
            let valueArrayDec = numDec?.split('');

            let valueConvertidoInt: number[] = valueArrayInt.map((value, index, array) => {
                if (value === '1') {
                    return Math.pow(2, index);
                }
                return 0;
            });

            let valueConvertidoDec: number[] = [];
            if (valueArrayDec) {
                valueConvertidoDec = valueArrayDec.map((value, index, array) => {
                    if (value === '1') {
                        return Math.pow(2, (index + 1) * -1);
                    }
                    return 0;
                });
            }

            let result = null;
            if (valueConvertidoInt.length) {
                result = String(valueConvertidoInt.reduce((acumulador, currentValue) => acumulador + currentValue, 0));
                let verifyZero = valueConvertidoDec.reduce((acumulador, currentValue) => acumulador + currentValue, 0);
                if (valueConvertidoDec.length && verifyZero !== 0) {
                    result = +result + verifyZero;
                }
            }

            return result;

        } else {
            let valueZero = numInt;
            let valueArrayInt: number[] = [];
            while (valueZero >= 1) {
                valueArrayInt.push(valueZero % 2);
                valueZero = Math.trunc(valueZero / 2);
            }
            if (!valueArrayInt.length && valueZero !== '')
                valueArrayInt.push(0);

            let valueOne = parseFloat("0." + numDec);
            let valueArrayDec = [];
            if (valueOne !== 0) {
                let valueString = null;
                while (+valueString !== 1 && valueArrayDec.length <= 31) {
                    valueArrayDec.push(Math.trunc(valueOne * 2));
                    valueString = String(valueOne * 2);
                    valueOne = parseFloat("0." + (valueString.substring(valueString.indexOf('.') + 1,)));

                }
            }
            const result = valueArrayInt.reverse().join('') + (valueArrayDec.join('') !== '' ? '.' + valueArrayDec.join('') : '');
            return result;
        }
    }

}
