public class Smartphone {
    // Atributos que caracterizam um smartphone
    private String marca;
    private String modelo;
    private int memoria;    // em gigabytes (GB)
    private int bateria;    // percentual da bateria

    // Construtor para inicializar o objeto Smartphone com seus atributos
    public Smartphone(String marca, String modelo, int memoria, int bateria) {
        this.marca = marca;
        this.modelo = modelo;
        this.memoria = memoria;
        this.bateria = bateria;
    }

    // Método para exibir as informações do smartphone
    public void exibirInfo() {
        System.out.println("Smartphone: " + marca + " " + modelo);
        System.out.println("Memória: " + memoria + "GB");
        System.out.println("Bateria: " + bateria + "%");
    }

    // Método para simular uma chamada telefônica
    public void fazerChamada(String numero) {
        if (bateria > 0) {
            System.out.println("Ligando para " + numero + "...");
            consumirBateria(5); // Consome 5% da bateria para a chamada
        } else {
            System.out.println("Bateria baixa. Não é possível fazer chamadas.");
        }
    }

    // Método para simular o ato de tirar uma foto
    public void tirarFoto() {
        if (bateria > 0) {
            System.out.println("Tirando uma foto com o " + modelo + "...");
            consumirBateria(3); // Consome 3% da bateria para tirar uma foto
        } else {
            System.out.println("Bateria baixa. Não é possível tirar foto.");
        }
    }

    // Método para simular o uso de um aplicativo
    public void usarApp(String appName) {
        if (bateria > 0) {
            System.out.println("Abrindo o aplicativo " + appName + "...");
            consumirBateria(2); // Consome 2% da bateria para usar um app
        } else {
            System.out.println("Bateria baixa. Não é possível usar aplicativos.");
        }
    }

    // Método privado para consumir a bateria
    private void consumirBateria(int consumo) {
        bateria -= consumo;
        if (bateria < 0) {
            bateria = 0;
        }
        System.out.println("Bateria atual: " + bateria + "%\n");
    }

    // Método principal para testar o funcionamento da classe Smartphone
    public static void main(String[] args) {
        // Cria um objeto Smartphone com as características desejadas
        Smartphone meuSmartphone = new Smartphone("Samsung", "Galaxy S21", 128, 100);

        // Exibe as informações iniciais do smartphone
        meuSmartphone.exibirInfo();

        // Simula algumas ações do smartphone
        meuSmartphone.fazerChamada("1234-5678");
        meuSmartphone.tirarFoto();
        meuSmartphone.usarApp("WhatsApp");

        // Exibe as informações atualizadas do smartphone
        meuSmartphone.exibirInfo();
    }
}
