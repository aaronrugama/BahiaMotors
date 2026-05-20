import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Keyboard,
} from 'react-native';
 
const ITBM = 0.07;
const INTERES_CREDITO = 0.08;
const AUMENTO_AUTOMATICO = 1500;
const ANOS_CREDITO = 9;
const MESES_CREDITO = ANOS_CREDITO * 12;
const PORCENTAJE_SALARIO = 0.30;
 
export default function App() {
  const [costo, setCosto] = useState('');
  const [salario, setSalario] = useState('');
  const [transmision, setTransmision] = useState(null); // 'manual' | 'automatica'
  const [formaPago, setFormaPago] = useState(null);     // 'contado' | 'credito'
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
 
  const fmt = (num) =>
    '$' + Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
 
  const calcular = () => {
    setError('');
    setResultado(null);
 
    const costoNum = parseFloat(costo);
    const salarioNum = parseFloat(salario);
 
    if (!costo || isNaN(costoNum) || costoNum <= 0) {
      setError('Ingresa un costo válido.');
      return;
    }
    if (!transmision) {
      setError('Selecciona el tipo de transmisión.');
      return;
    }
    if (!formaPago) {
      setError('Selecciona la forma de pago.');
      return;
    }
    if (formaPago === 'credito' && (!salario || isNaN(salarioNum) || salarioNum <= 0)) {
      setError('Ingresa un salario válido para aplicar al crédito.');
      return;
    }
 
    // Precio base ajustado por transmisión
    const precioBase = transmision === 'automatica'
      ? costoNum + AUMENTO_AUTOMATICO
      : costoNum;
 
    if (formaPago === 'contado') {
      const impuesto = precioBase * ITBM;
      const granTotal = precioBase + impuesto;
 
      setResultado({
        tipo: 'contado',
        precioBase,
        impuesto,
        granTotal,
      });
    } else {
      // Crédito: interés compuesto Cf = Ci(1+r)^n  donde n = 9 años
      const capitalFinal = precioBase * Math.pow(1 + INTERES_CREDITO, ANOS_CREDITO);
      const itbmTotal = capitalFinal * ITBM;
      const totalConITBM = capitalFinal + itbmTotal;
      const letraMensual = totalConITBM / MESES_CREDITO;
      const treintaPorciento = salarioNum * PORCENTAJE_SALARIO;
      const aprobado = treintaPorciento >= letraMensual;
 
      setResultado({
        tipo: 'credito',
        precioBase,
        capitalFinal,
        itbmTotal,
        totalConITBM,
        letraMensual,
        treintaPorciento,
        aprobado,
      });
    }
  };
 
  const limpiar = () => {
    setCosto('');
    setSalario('');
    setTransmision(null);
    setFormaPago(null);
    setResultado(null);
    setError('');
  };
 
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Venta de Auto</Text>
        <Text style={styles.subtitulo}>BahiaMotors</Text>
 
        {/* Costo */}
        <Text style={styles.label}>Costo del Auto ($)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 15000"
          keyboardType="decimal-pad"
          returnKeyType="done"
          value={costo}
          onChangeText={setCosto}

            onSubmitEditing={() => Keyboard.dismiss()}
        />
 
        {/* Salario */}
        <Text style={styles.label}>Salario Mensual ($)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 1200"
          keyboardType="decimal-pad"
          returnKeyType="done"
          value={salario}
          onChangeText={setSalario}

            onSubmitEditing={() => Keyboard.dismiss()}
        />
 
        {/* Transmisión */}
        <Text style={styles.label}>Transmisión</Text>

        {/*Tansmision Manual*/}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.opcion, transmision === 'manual' && styles.opcionActiva]}
            onPress={() => setTransmision('manual')}
          >
            <View style={styles.radioRow}>
              <View style={styles.radioCircle}>
                {transmision === 'manual' && <View style={styles.radioDot}/>}
              </View>
              <Text style={[styles.opcionTexto, transmision === 'manual' && styles.opcionTextoActivo]}>
                Manual
              </Text>
            </View>
          </TouchableOpacity>

          {/*Tansmision Automatica*/}
          <TouchableOpacity
            style={[styles.opcion, transmision === 'automatica' && styles.opcionActiva]}
            onPress={() => setTransmision('automatica')}
          >
            <View style={styles.radioRow}>
              <View style={styles.radioCircle}>
                {transmision === 'automatica' && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.opcionTexto, transmision === 'automatica' && styles.opcionTextoActivo]}>
                Automática (+$1,500)
              </Text>
            </View>
          </TouchableOpacity>
        </View>
 
        {/* Forma de pago */}
        <Text style={styles.label}>Forma de Pago</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.opcion, formaPago === 'contado' && styles.opcionActiva]}
            onPress={() => setFormaPago('contado')}
          >
            <View style={styles.radioRow}>
              <View style={styles.radioCircle}>
                {formaPago === 'contado' && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.opcionTexto, formaPago === 'contado' && styles.opcionTextoActivo]}>
                Contado
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.opcion, formaPago === 'credito' && styles.opcionActiva]}
            onPress={() => setFormaPago('credito')}
          >
            <View style={styles.radioRow}>
              <View style={styles.radioCircle}>
                {formaPago === 'credito' && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.opcionTexto, formaPago === 'credito' && styles.opcionTextoActivo]}>
                Crédito
              </Text>
            </View>
          </TouchableOpacity>
        </View>
 
        {/* Error */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
 
        {/* Botón calcular */}
        <TouchableOpacity style={styles.btnCalcular} onPress={calcular}>
          <Text style={styles.btnCalcularTexto}>Calcular</Text>
        </TouchableOpacity>
 
        {/* Resultados */}
        {resultado && (
          <View style={styles.resultadoBox}>
            <Text style={styles.resultadoTitulo}>
              {resultado.tipo === 'contado' ? 'Resultado — Contado' : 'Resultado — Crédito'}
            </Text>
 
            <View style={styles.filaResultado}>
              <Text style={styles.filaLabel}>Precio base:</Text>
              <Text style={styles.filaValor}>{fmt(resultado.precioBase)}</Text>
            </View>
 
            {resultado.tipo === 'contado' && (
              <>
                <View style={styles.filaResultado}>
                  <Text style={styles.filaLabel}>ITBM (7%):</Text>
                  <Text style={styles.filaValor}>{fmt(resultado.impuesto)}</Text>
                </View>
                <View style={[styles.filaResultado, styles.filaTotal]}>
                  <Text style={styles.filaTotalLabel}>Gran Total:</Text>
                  <Text style={styles.filaTotalValor}>{fmt(resultado.granTotal)}</Text>
                </View>
              </>
            )}
 
            {resultado.tipo === 'credito' && (
              <>
                <View style={styles.filaResultado}>
                  <Text style={styles.filaLabel}>Capital final (8% × 9 años):</Text>
                  <Text style={styles.filaValor}>{fmt(resultado.capitalFinal)}</Text>
                </View>
                <View style={styles.filaResultado}>
                  <Text style={styles.filaLabel}>ITBM sobre capital (7%):</Text>
                  <Text style={styles.filaValor}>{fmt(resultado.itbmTotal)}</Text>
                </View>
                <View style={styles.filaResultado}>
                  <Text style={styles.filaLabel}>Total con ITBM:</Text>
                  <Text style={styles.filaValor}>{fmt(resultado.totalConITBM)}</Text>
                </View>
                <View style={[styles.filaResultado, styles.filaTotal]}>
                  <Text style={styles.filaTotalLabel}>Letra mensual (108 meses):</Text>
                  <Text style={styles.filaTotalValor}>{fmt(resultado.letraMensual)}</Text>
                </View>
                <View style={styles.filaResultado}>
                  <Text style={styles.filaLabel}>30% de tu salario:</Text>
                  <Text style={styles.filaValor}>{fmt(resultado.treintaPorciento)}</Text>
                </View>
 
                <View style={[styles.estadoBox, resultado.aprobado ? styles.aprobado : styles.noAprobado]}>
                  <Text style={styles.estadoTexto}>
                    {resultado.aprobado ? 'APROBADO' : 'NO APROBADO'}
                  </Text>
                  <Text style={styles.estadoSub}>
                    {resultado.aprobado
                      ? 'El 30% de tu salario cubre la letra mensual.'
                      : 'El 30% de tu salario no cubre la letra mensual.'}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}
 
        {/* Botón limpiar */}
        {resultado && (
          <TouchableOpacity style={styles.btnLimpiar} onPress={limpiar}>
            <Text style={styles.btnLimpiarTexto}>Nueva Consulta</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitulo: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dce1e7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1a1a2e',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  opcionActiva: {
  },

  radioRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

radioCircle: {
  width: 18,
  height: 18,
  borderRadius: 9,
  borderWidth: 2,
  borderColor: '#0d6efd',
  alignItems: 'center',
  justifyContent: 'center',
},
radioDot: {
  width: 9,
  height: 9,
  borderRadius: 5,
  backgroundColor: '#0d6efd',
},

  opcionTexto: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  opcionTextoActivo: {
    color: '#0d6efd',
    fontWeight: '700',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  btnCalcular: {
    backgroundColor: '#0d6efd',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  btnCalcularTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultadoBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    },
  resultadoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 14,
    textAlign: 'center',
  },
  filaResultado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filaLabel: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  filaValor: {
    fontSize: 13,
    color: '#1a1a2e',
    fontWeight: '600',
  },
  filaTotal: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  filaTotalLabel: {
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '700',
    flex: 1,
  },
  filaTotalValor: {
    fontSize: 14,
    color: '#0d6efd',
    fontWeight: '800',
  },
  estadoBox: {
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  aprobado: {
    backgroundColor: '#d1f7e0',
  },
  noAprobado: {
    backgroundColor: '#fde8e8',
  },
  estadoTexto: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  estadoSub: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    textAlign: 'center',
  },
  btnLimpiar: {
    borderWidth: 1.5,
    borderColor: '#0d6efd',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  btnLimpiarTexto: {
    color: '#0d6efd',
    fontSize: 15,
    fontWeight: '600',
  },
});