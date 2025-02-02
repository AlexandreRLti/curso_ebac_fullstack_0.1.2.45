import java.util.Scanner;

public class MediaNotas {
    private double nota1, nota2, nota3, nota4;

    public MediaNotas(double nota1, double nota2, double nota3, double nota4) {
        this.nota1 = nota1;
        this.nota2 = nota2;
        this.nota3 = nota3;
        this.nota4 = nota4;
    }

    public double calcularMedia() {
        return (nota1 + nota2 + nota3 + nota4) / 4;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Digite a primeira nota: ");
        double nota1 = scanner.nextDouble();
        
        System.out.print("Digite a segunda nota: ");
        double nota2 = scanner.nextDouble();
        
        System.out.print("Digite a terceira nota: ");
        double nota3 = scanner.nextDouble();
        
        System.out.print("Digite a quarta nota: ");
        double nota4 = scanner.nextDouble();
        
        MediaNotas mediaNotas = new MediaNotas(nota1, nota2, nota3, nota4);
        System.out.println("A média das notas é: " + mediaNotas.calcularMedia());
        
        scanner.close();
    }
}
