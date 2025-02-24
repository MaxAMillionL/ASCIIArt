import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;

public class ArtMaker {
    BufferedImage image; // the image that gets read in from args
    HashMap<Integer, Character> pixels; // holds a double value for red in terms of black and white and assigns an ASCII character to it
    int scale; // self imposed limit for image resolution maximum
    final int BYTES = 256; // largest that alphaVals can have


    /*
     * Creates an instance of the ArtMaker object, which holds an image 
     * that is an ASCII version of imageFIle
     */
    public ArtMaker(int imageSize, File imageFile){
        // check for null case
        try {
            image = ImageIO.read(imageFile);
        } catch (IOException ex) {
            System.out.println("Error: imageFile is not accessable");
        }

        scale = imageSize;

        // initialize instance variables
        char[] myASCII  = " `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@".toCharArray();

        pixels = new HashMap<>();

        for(int i = 1; i <= myASCII.length; i++){
            pixels.put(BYTES * i / myASCII.length, myASCII[i - 1]);
        }

        // grayscale image
        image = grayscale(image);

        // lower resolution
        int newHeight, newWidth;
        if(image.getWidth() > image.getHeight()){
            newWidth = scale;
            newHeight = (int) ((double) image.getHeight() / image.getWidth() * scale);
        }
        else{
            newHeight = scale;
            newWidth = (int) ((double) image.getWidth() / image.getHeight() * scale);
        }
        image = ImageScaling.scaleImage(image, newWidth, newHeight);
    }  

    /*
     * Takes a buffered image input and returns a grayscale version of 
     * the image
     */
    private BufferedImage grayscale(BufferedImage image){
        if(image == null){
            throw new IllegalArgumentException("image is null for grayscale");
        }


        // create dummy image to grayscale from original
        BufferedImage newImage = new BufferedImage(
            image.getWidth(), image.getHeight(),  
            BufferedImage.TYPE_BYTE_GRAY);  

        // grayscale the image
        for (int y = 0; y < newImage.getHeight(); y++) {
            for (int x = 0; x < newImage.getWidth(); x++) {
                int rgb = image.getRGB(x, y);
                int r = (rgb >> 16) & 0xFF;
                int g = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;

                // Calculate luminance (commonly used method for grayscale conversion)
                int gray = (int) (0.299 * r + 0.587 * g + 0.114 * b);
                
                // Set the gray value to the new image
                int grayRGB = (gray << 16) | (gray << 8) | gray;
                newImage.setRGB(x, y, grayRGB);
            }
        }

        // return dummy image
        return newImage;
    }

    /* 
     * puts the image on a frame pixelated at the original resolution
     */
    public void displayImage(){
        JFrame frame = new JFrame("image display");
        BufferedImage imageDisplay = ImageScaling.scaleImage(image, image.getWidth()*scale, image.getHeight()*scale);
        frame.add(new JLabel(new ImageIcon(imageDisplay)));
        frame.setSize(imageDisplay.getWidth(), imageDisplay.getHeight());
        frame.setVisible(true);
    }

    /*
     * Turns an image into ASCII art
     */
    public String ASCII(){
        String art = "";
        for(int y = 0; y < image.getHeight(); y++){
            for(int x = 0; x < image.getWidth(); x++){
                int rgb = image.getRGB(x,y);
                int red = (rgb >> 16) & 0xFF;
                boolean working = true;
                while(red < BYTES + 1 && working){
                    if(pixels.get(red) != null){
                        art += pixels.get(red);
                        art += pixels.get(red);
                        working = false;
                    }
                    red++;
                }
            }
            art += '\n';
        }
        return art;
    }

    /*
     * Takes in args[0] as the filename in the directory
     */
    public static void main(String[] args) {
        File image = new File(".\\Images\\" + args[1]);
        ArtMaker artmaker = new ArtMaker(Integer.parseInt(args[0]), image);

        System.out.println(artmaker.ASCII());
    }
    
}
