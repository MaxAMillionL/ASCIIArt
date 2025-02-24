import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;

public class ImageScaling {

    public static BufferedImage scaleImage(Image originalImage, int targetWidth, int targetHeight) {
        // Create a scaled Image instance
        Image scaledImage = originalImage.getScaledInstance(targetWidth, targetHeight, Image.SCALE_SMOOTH);

        // Create a BufferedImage with the target dimensions
        BufferedImage bufferedScaledImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);

        // Get the Graphics2D object from the BufferedImage
        Graphics2D g2d = bufferedScaledImage.createGraphics();

        // Draw the scaled image onto the BufferedImage
        g2d.drawImage(scaledImage, 0, 0, null);
        g2d.dispose(); // Dispose of the Graphics2D context

        return bufferedScaledImage;
    }

    public static void main(String[] args) {
      // Load your original image here (e.g., using ImageIO.read())
      // For example:
      // File imageFile = new File("path/to/your/image.jpg");
      // BufferedImage originalImage = ImageIO.read(imageFile);
      // Replace the code below with the actual loading of your image

      BufferedImage originalImage = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);
      
      int targetWidth = 200;
      int targetHeight = 150;
      BufferedImage scaledBufferedImage = scaleImage(originalImage, targetWidth, targetHeight);

      // Now you can use the scaledBufferedImage
      // For example, save it to a file:
      // File output = new File("path/to/scaled/image.jpg");
      // ImageIO.write(scaledBufferedImage, "jpg", output);
    }
}